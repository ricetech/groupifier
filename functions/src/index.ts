import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import * as pg from 'pg-promise';
import { config, smtpConfig } from './databasesecret';
import * as nodemailer from 'nodemailer';
import { v4 as uuid } from 'uuid';
import * as api from './interfaces/api';
import { Solver } from './solver';

admin.initializeApp();

// eslint-disable-next-line no-unused-vars
const db = pg()(config);

const transporter = nodemailer.createTransport(smtpConfig, {
  from: 'Groupifier <no-reply@groupifier.space>',
});

function emailParticipantAdded(
  email: string,
  recipientName: string,
  hostName: string,
  sessionID: string,
  sessionName: string
): void {
  const url: string = 'https://groupifier.space/session?sid=' + sessionID;
  transporter.sendMail({
    to: email,
    subject: `ACTION REQUIRED: You've been added to the Groupifier session '${sessionName}'`,
    html: `<div style="color:black;"><p>Hi ${recipientName},<br /></p>
      <p>${hostName} has invited you to a new Groupifier Session named ${sessionName}.</p>
      <p>To submit your preferences for a group, please sign in with your email (${email}) using the link below ASAP.</p>
      <p><a href="${url}">${url}</a></p>
      <p>Regards,<br>The Groupifier Team</p></div>`,
  });
}

function emailParticipantGrouped(
  email: string,
  recipientName: string,
  sessionName: string,
  members: string[]
): void {
  transporter.sendMail({
    to: email,
    subject: `Your group members for '${sessionName}'`,
    text: `Hi ${recipientName},\n\nYour group members for the Groupifier Session named ${sessionName} have been decided. They are:\n
      ${members.join('\n')}\n
      Regards,
      The Groupifier Team`,
  });
}

export const createSession = functions.https.onCall(
  async (requestData: api.CreateSessionRequest, context) => {
    return await db.tx(async (t) => {
      // Create the host
      const hostID = await t
        .one({
          text:
            'INSERT INTO hosts (FirebaseUID, Name, Email) VALUES ($1, $2, $3) ON CONFLICT(email) DO UPDATE SET email=$3, firebaseUID=$1 RETURNING id',
          values: [
            context.auth!.uid,
            requestData.HostName,
            context.auth!.token.email,
          ],
        })
        .then((data) => data.id);

      const uniqueSessionID = uuid();

      // Create the session
      const sessionData = await t.one({
        text:
          'INSERT INTO sessions (UID, Name, HostID, GroupSize) VALUES ($1, $2, $3, $4) RETURNING extract(epoch from datetime) as Datetime, name, uid, id',
        values: [
          uniqueSessionID,
          requestData.SessionName,
          hostID,
          requestData.GroupSize,
        ],
      });

      // Variable to hold pending promises. This way, we can add the participants more quickly.
      const participantsPromises = [];

      // Create all the participants in the database
      for (const p of requestData.Participants) {
        participantsPromises.push(
          (async (participant) => {
            const participantData = await t.one({
              text:
                'INSERT INTO participants (Name, Email) VALUES ($1, $2) ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email RETURNING id',
              values: [
                participant.ParticipantName,
                participant.ParticipantEmail,
              ],
            });

            await t.none({
              text:
                'INSERT INTO ParticipantSessions (ParticipantID, SessionID) VALUES ($1, $2)',
              values: [participantData.id, sessionData.id],
            });
          })(p)
        );
      }

      // Wait for all participants to be added
      await Promise.all(participantsPromises);

      // Send the emails
      for (const participant of requestData.Participants) {
        emailParticipantAdded(
          participant.ParticipantEmail,
          participant.ParticipantName,
          requestData.HostName,
          uniqueSessionID,
          requestData.SessionName
        );
      }

      return {
        SessionDatetime: sessionData.datetime,
        SessionName: sessionData.name,
        SessionUID: sessionData.uid,
      };
    });
  }
);

export const getAllSessions = functions.https.onCall(async (data, context) => {
  const responseData = [];
  console.log(1);
  const sessionData = await db.any({
    text:
      'SELECT sessions.*, extract(epoch from datetime) as Datetime FROM sessions LEFT JOIN Hosts host ON sessions.hostid=host.id WHERE host.firebaseUID=$1',
    values: [context.auth!.uid],
  });

  for (const session of sessionData) {
    const totalParticipants = (
      await db.one({
        text:
          'SELECT COUNT(*) as count FROM participantSessions WHERE SessionID=$1',
        values: [session.id],
      })
    ).count;

    const respondedParticipants = (
      await db.one({
        text:
          'SELECT COUNT(DISTINCT sourceparticipantid) as count FROM rankings WHERE sessionid=$1',
        values: [session.id],
      })
    ).count;

    responseData.push({
      TotalParticipants: totalParticipants,
      RespondedParticipants: respondedParticipants,
      SessionName: session.name,
      SessionDatetime: session.datetime,
      SessionUID: session.uid,
      SessionStatus: session.status, // TODO: Implement status
    });
  }

  return responseData;
});

export const solveSession = functions.https.onCall(
  async (requestData: api.SolveSessionRequest, context) => {
    const sessionData = await db.one({
      text: 'SELECT id, groupSize, name FROM sessions WHERE uid=$1',
      values: [requestData.SessionUID],
    });

    const rawRankings = await db.any({
      text: 'SELECT * FROM rankings WHERE rankings.sessionID=$1',
      values: [sessionData.id],
    });

    const participants = await db.any({
      text:
        'SELECT participants.* FROM participantSessions ' +
        'LEFT JOIN participants ON participants.id=participantSessions.participantid ' +
        'WHERE participantSessions.sessionid=$1',
      values: [sessionData.id],
    });

    const solver = new Solver(
      rawRankings,
      participants,
      parseInt(sessionData.groupsize)
    );
    const groups = solver.solve();

    return await db.tx(async (t) => {
      // Delete any existing groups
      await t.none({
        text: 'DELETE FROM Groups WHERE SessionID=$1',
        values: [sessionData.id],
      });

      for (const group of groups) {
        const groupID = (
          await t.one({
            text: 'INSERT INTO Groups (SessionID) VALUES ($1) RETURNING id',
            values: [sessionData.id],
          })
        ).id;

        for (const participant of group) {
          await t.none({
            text:
              'INSERT INTO ParticipantGroups (SessionID, ParticipantID, GroupID) VALUES ($1, $2, $3)',
            values: [sessionData.id, participant.id, groupID],
          });

          emailParticipantGrouped(
            participant.email,
            participant.name,
            sessionData.name,
            group.map((p) => p.name)
          );
        }
      }

      return { SessionStatus: 'SOLVED' }; // TODO: Use enums
    });
  }
);

export const getSession = functions.https.onCall(
  async (requestData: api.GetSessionRequest, context) => {
    const sessionData = await db.one({
      text:
        'SELECT sessions.*, extract(epoch from datetime) as Datetime, hosts.firebaseuid as hostuid ' +
        'FROM sessions LEFT JOIN hosts ON sessions.hostid=hosts.id WHERE sessions.uid=$1',
      values: [requestData.SessionUID],
    });
    console.log(sessionData.hostuid);
    console.log(context.auth!.uid);

    if (sessionData.hostuid !== context.auth!.uid) {
      throw new Error('You are not authorized to access this resource!');
    }

    const totalParticipants = (
      await db.one({
        text:
          'SELECT COUNT(*) as count FROM participantSessions WHERE SessionID=$1',
        values: [sessionData.id],
      })
    ).count;

    const respondedParticipants = (
      await db.one({
        text:
          'SELECT COUNT(DISTINCT sourceparticipantid) as count FROM rankings WHERE sessionid=$1',
        values: [sessionData.id],
      })
    ).count;

    const participantsList = (
      await db.any({
        text:
          'SELECT participants.name as ParticipantName FROM participantSessions ' +
          'LEFT JOIN participants ON participantSessions.participantID=participants.id WHERE participantSessions.sessionID=$1',
        values: [sessionData.id],
      })
    ).map((value) => {
      return { ParticipantName: value.participantname }; // Need to do this to get the uppercase the name
    });

    const groupIDs = await db.any({
      text: 'SELECT * FROM Groups WHERE SessionID=$1',
      values: [sessionData.id],
    });

    const groups = [];
    for (const group of groupIDs) {
      const participants = await db.any({
        text:
          'SELECT participants.name as name FROM participantgroups ' +
          'LEFT JOIN participants ON participantgroups.participantid=participants.id ' +
          'WHERE participantgroups.groupid=$1',
        values: [group.id],
      });

      const participantsNames = participants.map((p) => {
        return { ParticipantName: p.name };
      });

      groups.push(participantsNames);
    }

    return {
      TotalParticipants: totalParticipants,
      RespondedParticipants: respondedParticipants,
      SessionName: sessionData.name,
      SessionDatetime: sessionData.datetime,
      SessionUID: sessionData.uid,
      SessionStatus: sessionData.status, // TODO: Implement status
      Participants: participantsList,
      ParticipantsGroups: groups,
    };
  }
);

export const getSessionParticipants = functions.https.onCall(
  async (requestData: api.GetSessionParticipantRequest, context) => {
    const sessionParticipants = (
      await db.any({
        text:
          'SELECT participants.id as id, participants.name as name FROM participantSessions ' +
          'LEFT JOIN participants ON participants.id=participantSessions.participantID ' +
          'LEFT JOIN sessions ON sessions.id=participantSessions.sessionID ' +
          'WHERE sessions.uid=$1',
        values: [requestData.SessionUID],
      })
    ).map((value) => {
      return { ParticipantName: value.name, ParticipantID: value.id };
    });

    return { Participants: sessionParticipants };
  }
);

export const setParticipantFirebaseUID = functions.https.onCall(
  async (data, context) => {
    await db.none({
      text: 'UPDATE participants SET firebaseuid=$1 WHERE email=$2',
      values: [context.auth!.uid, context.auth!.token.email],
    });

    return {};
  }
);

export const updateParticipantPreferences = functions.https.onCall(
  async (requestData: api.UpdateParticipantPreferencesRequest, context) => {
    const sessionID = (
      await db.one({
        text: 'SELECT id FROM sessions WHERE uid=$1',
        values: [requestData.SessionUID],
      })
    ).id;

    let isInSession = 0;

    console.log(0);
    try {
      isInSession = (
        await db.one({
          text:
            'SELECT COUNT(*) as count FROM participantSessions ' +
            'LEFT JOIN participants ON participants.id=participantSessions.participantID ' +
            'WHERE participants.firebaseuid=$1 AND sessionID=$2',
          values: [context.auth!.uid, sessionID],
        })
      ).count;
      if (isInSession === 0) {
        throw new Error('You are not in this session.');
      }
    } catch (e) {
      throw new Error('You are not in this session.');
    }

    return await db.tx(async (t) => {
      const callerID = (
        await t.one({
          text: 'SELECT id FROM participants WHERE firebaseuid=$1',
          values: [context.auth!.uid],
        })
      ).id;

      // Clear any existing preferences
      await t.none({
        text: 'DELETE FROM rankings WHERE sourceParticipantID=$1',
        values: [callerID],
      });

      for (const participant of requestData.DreamParticipants) {
        console.log(requestData.DreamParticipants);
        console.log(participant);
        await t.none({
          text:
            'INSERT INTO rankings (SessionID, SourceParticipantID, TargetParticipantID, Rank) VALUES ($1, $2, $3, 2)',
          values: [sessionID, callerID, participant],
        });
      }

      for (const participant of requestData.NightmareParticipants) {
        console.log(participant);
        await t.none({
          text:
            'INSERT INTO rankings (SessionID, SourceParticipantID, TargetParticipantID, Rank) VALUES ($1, $2, $3, 0)',
          values: [sessionID, callerID, participant],
        });
      }

      return {};
    });
  }
);
