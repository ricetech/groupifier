import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();

import * as pg from "pg-promise";
import {v4 as uuid} from "uuid";
import {config} from "./databasesecret";
// eslint-disable-next-line no-unused-vars
import * as api from "./interfaces/api";

// eslint-disable-next-line no-unused-vars
const db = pg()(config);

export const createSession = functions.https.onRequest(async (request, response) => {
  const requestData: api.CreateSessionRequest = request.body;

  await db.tx(async (t) => {
    // Store the newly created participants
    const participantsIDs: number[] = [];

    // Variable to hold pending promises. This way, we can add the participants more quickly.
    const participantsPromises = [];

    // Create all the participants in the database
    for (const participant of requestData.Participants) {
      participantsPromises.push(async () => {
        const participantID = await t.one({
          text: "INSERT INTO participants (Name, Email) VALUES ($1, $2) RETURNING id",
          values: [participant.ParticipantName, participant.ParticipantEmail],
        }).then((data) => data.id);

        participantsIDs.push(participantID);
      });
    }

    // Wait for all participants to be added
    await Promise.all(participantsPromises);

    // Create the host
    const hostID = await t.one({
      text: "INSERT INTO hosts (Name, Email) VALUES ($1, $2) RETURNING id",
      values: [requestData.HostName, requestData.HostEmail],
    }).then((data) => data.id);

    const uniqueSessionID = uuid();

    // Finally create the session
    const sessionData = await t.one({
      text: "INSERT INTO sessions (UID, Name, HostID) VALUES ($1, $2, $3) RETURNING extract(epoch from datetime) as Datetime, name, uid",
      values: [uniqueSessionID, requestData.SessionName, hostID],
    });

    response
        .status(200)
        .json({
          Datetime: sessionData.datetime,
          SessionName: sessionData.name,
          SessionUID: sessionData.uid})
        .end();
  });
});


// export const test = functions.https.onRequest((request, response) => {
//     database.
// });
