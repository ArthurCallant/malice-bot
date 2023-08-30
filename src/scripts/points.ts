import * as dotenv from 'dotenv';
dotenv.config();
import * as fs from 'fs/promises';
import * as path from 'path';
import * as process from 'process';
import { authenticate } from '@google-cloud/local-auth';
import { google } from 'googleapis';

const spreadsheetId = process.env.POINTS_SPREADSHEET_ID;

// TODO: WIP!! Right now can only get balance by username
// Future release will include option to update balance

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = path.join(process.cwd(), 'token.json');
const CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');

/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
async function loadSavedCredentialsIfExist() {
  try {
    const content: any = await fs.readFile(TOKEN_PATH);
    const credentials = JSON.parse(content);
    return google.auth.fromJSON(credentials);
  } catch (err) {
    return null;
  }
}

/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
async function saveCredentials(client) {
  const content: any = await fs.readFile(CREDENTIALS_PATH);
  const keys = JSON.parse(content);
  const key = keys.installed || keys.web;
  const payload = JSON.stringify({
    type: 'authorized_user',
    client_id: key.client_id,
    client_secret: key.client_secret,
    refresh_token: client.credentials.refresh_token
  });
  await fs.writeFile(TOKEN_PATH, payload);
}

/**
 * Load or request or authorization to call APIs.
 */
async function authorize() {
  let client: any = await loadSavedCredentialsIfExist();
  if (client) {
    return client;
  }
  client = await authenticate({
    scopes: SCOPES,
    keyfilePath: CREDENTIALS_PATH
  });
  if (client.credentials) {
    await saveCredentials(client);
  }
  console.log(client);
  return client;
}

async function listUsersPoints(auth) {
  const sheets = google.sheets({ version: 'v4', auth });
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: `${spreadsheetId}`,
    range: 'Sheet1!A:B'
  });
  const rows = res.data.values;
  if (!rows || rows.length === 0) {
    console.log('No data found.');
    return;
  }
  const output = rows
    .map((row) => {
      return `${row[0]},${row[1]}`;
    })
    .join('\n');

  try {
    await fs.writeFile('src/public/output/regen-points.txt', output);
    console.log('The points file has been updated.');
  } catch (e) {
    console.log(e);
  }
}

export async function getPointsByUsername(username) {
  // First make sure the local coins file is up to date with the spreadsheet (SSOT)
  updatePointsFile();

  const file = await fs.readFile('src/public/output/regen-points.txt', 'utf-8');
  const lines = file.split('\n');

  let pointValue;
  for (const line of lines) {
    const [user, points] = line.split(',');
    if (user.toLowerCase() === username.toLowerCase()) {
      pointValue = points;
      break;
    }
  }
  return pointValue;
}

// getPointsByUsername('regen Matt');

export async function updatePointsFile() {
  const auth = await authorize();
  try {
    await listUsersPoints(auth);
  } catch (e) {
    console.error(e);
  }
}

export async function getAllPointsSorted() {
  updatePointsFile();

  const file = await fs.readFile('src/public/output/regen-points.txt', 'utf-8');
  const lines = file.split('\n');

  return lines
    .sort((lineA, lineB) => {
      const [_userA, pointsA] = lineA.split(',');
      const [_userB, pointsB] = lineB.split(',');

      return (pointsB as unknown as number) - (pointsA as unknown as number);
    })
    .map((line) => {
      const [username, points] = line.split(',');
      return {
        username,
        points
      };
    });
}

//
//
//
// async function pushCsvToSheet(csv) {
//   // TODO
//   const request = {
//     spreadsheetId: spreadsheetId,
//     resource: {
//       valueInputOption: '',
//       data: csv
//     }
//   };
//   try {
//     const response = (await sheets.spreadsheets.values.batchUpdate(request)).data;
//     console.log(JSON.stringify(response, null, 2));
//   } catch (err) {
//     console.error(err);
//   }
// }

// async function addPointsToUser(username, points) {
//   const res = await fs.readFile('src/public/output/regen-points.txt', 'utf-8');
//   return res
//     .split('\n')
//     .map((u) => {
//       const user = u.split(',')[0];
//       let pointTally = parseInt(u.split(',')[1]);
//       if (user.toLowerCase() === username.toLowerCase()) {
//         pointTally = pointTally + points;
//       }
//       return `${user},${pointTally}`;
//     })
//     .join('\n');
// }

// async function saveToFile(content, path) {
//   fs.writeFile(path, content, (err) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     console.log('The points file has been updated.');
//   });
// }

// function convertLsvToCsv(content) {
//   return content.split('\n').join(',');
// }
// const outputing = await addPointsToUser("Belgiska", 23);
// saveToFile(outputing, "src/public/output/regen-points.txt");

// authorize().then(listUsersPoints).catch(console.error);
