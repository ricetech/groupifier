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

function emailParticipantAdded(
    email: string, recipientName: string, hostName: string, sessionID: string, sessionName: string
): boolean {
    const url: string = "https://groupifier.space/session?sid=" + sessionID;
    transporter.sendMail({
        to: email,
        subject: `ACTION REQUIRED: You've been added to the Groupifier session '${sessionName}'`,
        text: `Hi ${recipientName},\n\n${hostName} has invited you 
        to a new Groupifier Session named ${sessionName}.\n
        To submit your preferences for a group, please sign in with
        your email (${email}) using the link below ASAP.\n\n
        ${url}\n\n
        Regards,\n
        The Groupifier Team`
    });
    return false;
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
            'INSERT INTO hosts (FirebaseUID, Name, Email) VALUES ($1, $2, $3) ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email RETURNING id',
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

    console.log(1);
    for (const session of sessionData) {
      console.log(session);
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
