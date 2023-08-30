"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPointsSorted = exports.updatePointsFile = exports.getPointsByUsername = void 0;
var dotenv = require("dotenv");
dotenv.config();
var fs = require("fs/promises");
var path = require("path");
var process = require("process");
var local_auth_1 = require("@google-cloud/local-auth");
var googleapis_1 = require("googleapis");
var spreadsheetId = process.env.POINTS_SPREADSHEET_ID;
// TODO: WIP!! Right now can only get balance by username
// Future release will include option to update balance
// If modifying these scopes, delete token.json.
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
var TOKEN_PATH = path.join(process.cwd(), 'token.json');
var CREDENTIALS_PATH = path.join(process.cwd(), 'credentials.json');
/**
 * Reads previously authorized credentials from the save file.
 *
 * @return {Promise<OAuth2Client|null>}
 */
function loadSavedCredentialsIfExist() {
    return __awaiter(this, void 0, void 0, function () {
        var content, credentials, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, fs.readFile(TOKEN_PATH)];
                case 1:
                    content = _a.sent();
                    credentials = JSON.parse(content);
                    return [2 /*return*/, googleapis_1.google.auth.fromJSON(credentials)];
                case 2:
                    err_1 = _a.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
/**
 * Serializes credentials to a file comptible with GoogleAUth.fromJSON.
 *
 * @param {OAuth2Client} client
 * @return {Promise<void>}
 */
function saveCredentials(client) {
    return __awaiter(this, void 0, void 0, function () {
        var content, keys, key, payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, fs.readFile(CREDENTIALS_PATH)];
                case 1:
                    content = _a.sent();
                    keys = JSON.parse(content);
                    key = keys.installed || keys.web;
                    payload = JSON.stringify({
                        type: 'authorized_user',
                        client_id: key.client_id,
                        client_secret: key.client_secret,
                        refresh_token: client.credentials.refresh_token
                    });
                    return [4 /*yield*/, fs.writeFile(TOKEN_PATH, payload)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Load or request or authorization to call APIs.
 */
function authorize() {
    return __awaiter(this, void 0, void 0, function () {
        var client;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, loadSavedCredentialsIfExist()];
                case 1:
                    client = _a.sent();
                    if (client) {
                        return [2 /*return*/, client];
                    }
                    return [4 /*yield*/, (0, local_auth_1.authenticate)({
                            scopes: SCOPES,
                            keyfilePath: CREDENTIALS_PATH
                        })];
                case 2:
                    client = _a.sent();
                    if (!client.credentials) return [3 /*break*/, 4];
                    return [4 /*yield*/, saveCredentials(client)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    console.log(client);
                    return [2 /*return*/, client];
            }
        });
    });
}
function listUsersPoints(auth) {
    return __awaiter(this, void 0, void 0, function () {
        var sheets, res, rows, output, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    sheets = googleapis_1.google.sheets({ version: 'v4', auth: auth });
                    return [4 /*yield*/, sheets.spreadsheets.values.get({
                            spreadsheetId: "".concat(spreadsheetId),
                            range: 'Sheet1!A:B'
                        })];
                case 1:
                    res = _a.sent();
                    rows = res.data.values;
                    if (!rows || rows.length === 0) {
                        console.log('No data found.');
                        return [2 /*return*/];
                    }
                    output = rows
                        .map(function (row) {
                        return "".concat(row[0], ",").concat(row[1]);
                    })
                        .join('\n');
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, fs.writeFile('src/public/output/regen-points.txt', output)];
                case 3:
                    _a.sent();
                    console.log('The points file has been updated.');
                    return [3 /*break*/, 5];
                case 4:
                    e_1 = _a.sent();
                    console.log(e_1);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function getPointsByUsername(username) {
    return __awaiter(this, void 0, void 0, function () {
        var file, lines, pointValue, _i, lines_1, line, _a, user, points;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // First make sure the local coins file is up to date with the spreadsheet (SSOT)
                    updatePointsFile();
                    return [4 /*yield*/, fs.readFile('src/public/output/regen-points.txt', 'utf-8')];
                case 1:
                    file = _b.sent();
                    lines = file.split('\n');
                    for (_i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                        line = lines_1[_i];
                        _a = line.split(','), user = _a[0], points = _a[1];
                        if (user.toLowerCase() === username.toLowerCase()) {
                            pointValue = points;
                            break;
                        }
                    }
                    return [2 /*return*/, pointValue];
            }
        });
    });
}
exports.getPointsByUsername = getPointsByUsername;
// getPointsByUsername('regen Matt');
function updatePointsFile() {
    return __awaiter(this, void 0, void 0, function () {
        var auth, e_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, authorize()];
                case 1:
                    auth = _a.sent();
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, listUsersPoints(auth)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    e_2 = _a.sent();
                    console.error(e_2);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.updatePointsFile = updatePointsFile;
function getAllPointsSorted() {
    return __awaiter(this, void 0, void 0, function () {
        var file, lines;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    updatePointsFile();
                    return [4 /*yield*/, fs.readFile('src/public/output/regen-points.txt', 'utf-8')];
                case 1:
                    file = _a.sent();
                    lines = file.split('\n');
                    return [2 /*return*/, lines
                            .sort(function (lineA, lineB) {
                            var _a = lineA.split(','), _userA = _a[0], pointsA = _a[1];
                            var _b = lineB.split(','), _userB = _b[0], pointsB = _b[1];
                            return pointsB - pointsA;
                        })
                            .map(function (line) {
                            var _a = line.split(','), username = _a[0], points = _a[1];
                            return {
                                username: username,
                                points: points
                            };
                        })];
            }
        });
    });
}
exports.getAllPointsSorted = getAllPointsSorted;
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
