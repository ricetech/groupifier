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

export const createSession = functions.https.onRequest(
  async (request, response) => {
    const requestData: api.CreateSessionRequest = request.body;
    const callerData = await authUser(request);

    await db.tx(async (t) => {
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

            participantsData.push(participantData);
          })(p)
        );
      }

      // Wait for all participants to be added
      await Promise.all(participantsPromises);

      // Create the host
      const hostID = await t
        .one({
          text:
            'INSERT INTO hosts (FirebaseUID, Name, Email) VALUES ($1, $2, $3) ON CONFLICT(email) DO UPDATE SET email=EXCLUDED.email RETURNING id',
          values: [callerData.uid, requestData.HostName, callerData.email],
        })
        .then((data) => data.id);

      const uniqueSessionID = uuid();

      // Finally create the session
      const sessionData = await t.one({
        text:
          'INSERT INTO sessions (UID, Name, HostID) VALUES ($1, $2, $3) RETURNING extract(epoch from datetime) as Datetime, name, uid',
        values: [uniqueSessionID, requestData.SessionName, hostID],
      });

      response
        .status(200)
        .json({
          Datetime: sessionData.datetime,
          SessionName: sessionData.name,
          SessionUID: sessionData.uid,
        })
        .end();
    });
  }
);
