// import * as functions from "firebase-functions";

import * as admin from "firebase-admin";
admin.initializeApp();

import * as pg from "pg-promise";
import {config} from "./databasesecret";

const db = pg()(config);

// eslint-disable-next-line require-jsdoc
async function test() {
  const users = await db.any("SELECT * FROM Groups");
  console.log(users);
}

test();

// export const test = functions.https.onRequest((request, response) => {
//     database.
// });
