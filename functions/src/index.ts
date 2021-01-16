import * as functions from 'firebase-functions';

import * as admin from 'firebase-admin';
import * as pg from 'pg-promise';
import { config, smtpConfig } from './databasesecret';
import * as nodemailer from 'nodemailer';
import { v4 as uuid } from 'uuid';
// eslint-disable-next-line no-unused-vars
import * as api from './interfaces/api';
// eslint-disable-next-line no-unused-vars
import { auth } from 'firebase-admin/lib/auth';
import { GetSessionRequest } from './interfaces/api';

admin.initializeApp();

// eslint-disable-next-line no-unused-vars
const db = pg()(config);

const transporter = nodemailer.createTransport(smtpConfig, {
  from: 'no-reply@groupifier.space',
});

/**
 * Decodes the token sent in the 'Authorization' header. Note that some other checks might need to be done to make
 * sure the user is indeed allowed to access a resource.
 *
 * @param {functions.https.Request} request - Incoming HTTP request
 */
async function authUser(
  request: functions.https.Request
): Promise<auth.DecodedIdToken> {
  const token = request.get('Authorization');
  if (token === undefined) {
    throw new Error('Not authenticated!');
  }

  return await admin.auth().verifyIdToken(token);
}

export const createSession = functions.https.onRequest(
  async (request, response) => {
    const requestData: api.CreateSessionRequest = request.body;
    const callerData = await authUser(request);

    await db.tx(async (t) => {
      // Create the host
      const hostID = await t
        .one({
          text:
            'INSERT INTO hosts (FirebaseUID, Name, Email) VALUES ($1, $2, $3) ON CONFLICT(email) DO UPDATE SET email=$3, firebaseUID=$1 RETURNING id',
          values: [callerData.uid, requestData.HostName, callerData.email],
        })
        .then((data) => data.id);

      const uniqueSessionID = uuid();

      // Create the session
      const sessionData = await t.one({
        text:
          'INSERT INTO sessions (UID, Name, HostID) VALUES ($1, $2, $3) RETURNING extract(epoch from datetime) as Datetime, name, uid, id',
        values: [uniqueSessionID, requestData.SessionName, hostID],
      });

      // Store the newly created participants
      const participantsData: number[] = [];

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

            participantsData.push(participantData);
          })(p)
        );
      }

      // Wait for all participants to be added
      await Promise.all(participantsPromises);

      response
        .status(200)
        .json({
          SessionDatetime: sessionData.datetime,
          SessionName: sessionData.name,
          SessionUID: sessionData.uid,
        })
        .end();
    });
  }
);

export const getAllSessions = functions.https.onRequest(
  async (request, response) => {
    const callerData = await authUser(request);

    const responseData = [];
    console.log(1);
    const sessionData = await db.any({
      text:
        'SELECT sessions.*, extract(epoch from datetime) as Datetime FROM sessions LEFT JOIN Hosts host ON sessions.hostid=host.id WHERE host.firebaseUID=$1',
      values: [callerData.uid],
    });

    for (const session of sessionData) {
      const totalParticipants = (
        await db.one({
          text:
            'SELECT COUNT(*) as count FROM participantSessions WHERE SessionID=$1',
          values: [session.id],
        })
      ).count;

      responseData.push({
        TotalParticipants: totalParticipants,
        RespondedParticipants: 0, // TODO: Implement this
        SessionName: session.name,
        SessionDatetime: session.datetime,
        SessionUID: session.uid,
        SessionStatus: session.status, // TODO: Implement status
      });
    }

    response.status(200).json(responseData).end();
  }
);

export const solveSession = functions.https.onRequest(
  async (request, response) => {}
);

export const getSession = functions.https.onRequest(
  async (request, response) => {
    const requestData: GetSessionRequest = <GetSessionRequest>(
      (<unknown>request.query)
    );
    const callerData = await authUser(request);

    const sessionData = await db.one({
      text:
        'SELECT sessions.*, extract(epoch from datetime) as Datetime, hosts.firebaseuid as hostuid ' +
        'FROM sessions LEFT JOIN hosts ON sessions.hostid=hosts.id WHERE sessions.uid=$1',
      values: [requestData.SessionUID],
    });
    console.log(sessionData.hostuid);
    console.log(callerData.uid);

    if (sessionData.hostuid !== callerData.uid) {
      throw new Error('You are not authorized to access this resource!');
    }

    const totalParticipants = (
      await db.one({
        text:
          'SELECT COUNT(*) as count FROM participantSessions WHERE SessionID=$1',
        values: [sessionData.id],
      })
    ).count;

    const participantsList = await db.any({
      text:
        'SELECT participants.name as ParticipantName FROM participantSessions ' +
        'LEFT JOIN participants ON participantSessions.participantID=participants.id WHERE participantSessions.sessionID=$1',
      values: [sessionData.id],
    });

    response
      .status(200)
      .json({
        TotalParticipants: totalParticipants,
        RespondedParticipants: 0, // TODO: Implement this
        SessionName: sessionData.name,
        SessionDatetime: sessionData.datetime,
        SessionUID: sessionData.uid,
        SessionStatus: sessionData.status, // TODO: Implement status
        Participants: participantsList,
        ParticipantsGroups: null, // TODO: Implement this
      })
      .end();
  }
);
