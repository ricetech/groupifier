// import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();

import * as pg from "pg-promise";
import { config, smtpConfig } from "./databasesecret";
import * as nodemailer from 'nodemailer';

const db = pg()(config);

const transporter = nodemailer.createTransport(smtpConfig, {
  from: "no-reply@groupifier.space"
});

// eslint-disable-next-line require-jsdoc
async function test() {
  const users = await db.any("SELECT * FROM Groups");
  console.log(users);
}

test();

// export const test = functions.https.onRequest((request, response) => {
//     database.
// });
