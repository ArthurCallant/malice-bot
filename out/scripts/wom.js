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
exports.getPetsOrLogTopTen = exports.getBalance = exports.getResults = exports.getColResMap = exports.getClanRankCalculator = exports.getCommands = exports.getPlayerBossStat = exports.getPlayerSkillStat = exports.getPlayerBossStats = exports.getPlayerStats = exports.getCompCalendar = exports.getGroupCompetitions = exports.getMonthlyGains = exports.getTopTen = exports.getAllDisplayNames = void 0;
var utils_1 = require("@wise-old-man/utils");
var axios_1 = require("axios");
var enums_js_1 = require("../constants/enums.js");
var handling_1 = require("./errors/handling");
var utils_2 = require("./utils/utils");
var points_1 = require("./points");
var discord_js_1 = require("discord.js");
var messages_js_1 = require("../constants/messages.js");
var luxon_1 = require("luxon");
var blacklist_1 = require("../constants/blacklist");
var womClient = new utils_1.WOMClient();
function getAllDisplayNames(groupId) {
    return __awaiter(this, void 0, void 0, function () {
        var memberships, displayNames, e_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, womClient.groups.getGroupDetails(groupId)];
                case 1:
                    memberships = (_a.sent()).memberships;
                    displayNames = memberships.map(function (p) {
                        return p.player.displayName;
                    });
                    return [2 /*return*/, displayNames.filter(function (name) { return !blacklist_1.BLACKLIST.includes(name); })];
                case 2:
                    e_1 = _a.sent();
                    (0, handling_1.allCatcher)(e_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getAllDisplayNames = getAllDisplayNames;
function getTopTen(msg, groupId, metric) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, sortedPointsArray, memberships, sortedMemberships, e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 7, , 8]);
                    _a = metric;
                    switch (_a) {
                        case 'pets': return [3 /*break*/, 1];
                        case 'log': return [3 /*break*/, 1];
                        case 'balance': return [3 /*break*/, 2];
                    }
                    return [3 /*break*/, 4];
                case 1:
                    getPetsOrLogTopTen(msg, groupId, metric);
                    return [3 /*break*/, 6];
                case 2: return [4 /*yield*/, (0, points_1.getAllPointsSorted)()];
                case 3:
                    sortedPointsArray = (_b.sent())
                        .filter(function (user) { return !blacklist_1.BLACKLIST.includes(user.username); })
                        .slice(0, 10);
                    msg.reply((0, utils_2.buildMessage)(sortedPointsArray, metric));
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, womClient.groups.getGroupDetails(groupId)];
                case 5:
                    memberships = (_b.sent()).memberships;
                    sortedMemberships = (0, utils_2.sortMembershipsByMetric)(memberships, metric)
                        .filter(function (user) { return !blacklist_1.BLACKLIST.includes(user.player.displayName); })
                        .slice(0, 10);
                    msg.reply((0, utils_2.buildMessage)(sortedMemberships, metric));
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 8];
                case 7:
                    e_2 = _b.sent();
                    (0, handling_1.topTenError)(e_2, msg);
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
exports.getTopTen = getTopTen;
function getMonthlyGains(msg, groupId, periodObject) {
    if (periodObject === void 0) { periodObject = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var gainsPeriod, sdString, edString, ehbStats, ehpStats, expStats, message, e_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    gainsPeriod = (0, utils_2.getStartToEndPeriod)(periodObject);
                    sdString = luxon_1.DateTime.fromISO(gainsPeriod.startDate).toFormat('d LLLL yyyy');
                    edString = luxon_1.DateTime.fromISO(gainsPeriod.endDate).toFormat('d LLLL yyyy');
                    return [4 /*yield*/, (0, utils_2.fetchGroupGains)(womClient, groupId, gainsPeriod, 'ehb')];
                case 1:
                    ehbStats = _a.sent();
                    return [4 /*yield*/, (0, utils_2.fetchGroupGains)(womClient, groupId, gainsPeriod, 'ehp')];
                case 2:
                    ehpStats = _a.sent();
                    return [4 /*yield*/, (0, utils_2.fetchGroupGains)(womClient, groupId, gainsPeriod, 'overall')];
                case 3:
                    expStats = _a.sent();
                    message = (0, utils_2.buildMessage)([], 'month', {
                        sdString: sdString,
                        edString: edString,
                        expStats: expStats,
                        ehbStats: ehbStats,
                        ehpStats: ehpStats
                    });
                    msg.reply(message);
                    return [3 /*break*/, 5];
                case 4:
                    e_3 = _a.sent();
                    (0, handling_1.allCatcher)(e_3, msg);
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
exports.getMonthlyGains = getMonthlyGains;
function getGroupCompetitions(msg, groupId) {
    return __awaiter(this, void 0, void 0, function () {
        var now_1, ongoingComps_1, futureComps_1, competitions, message, e_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    now_1 = new Date();
                    ongoingComps_1 = [];
                    futureComps_1 = [];
                    return [4 /*yield*/, womClient.groups.getGroupCompetitions(groupId)];
                case 1:
                    competitions = _a.sent();
                    message = '';
                    competitions.forEach(function (comp) {
                        if (comp.startsAt < now_1 && comp.endsAt > now_1) {
                            ongoingComps_1.push(comp.title);
                        }
                        else if (comp.startsAt > now_1) {
                            futureComps_1.push(comp.title);
                        }
                    });
                    ongoingComps_1.length > 0
                        ? (message += "The ongoing competitions are: ".concat(ongoingComps_1
                            .map(function (c) {
                            return "".concat(c);
                        })
                            .join(', ')))
                        : (message += 'There are currently no ongoing competitions');
                    futureComps_1.length > 0
                        ? (message += "The future competitions are: ".concat(futureComps_1
                            .map(function (c) {
                            return "".concat(c);
                        })
                            .join(', ')))
                        : (message += '\n\nThere are currently no future competitions');
                    msg.reply(message);
                    return [3 /*break*/, 3];
                case 2:
                    e_4 = _a.sent();
                    (0, handling_1.allCatcher)(e_4, msg);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getGroupCompetitions = getGroupCompetitions;
function getCompCalendar(msg, groupId) {
    return __awaiter(this, void 0, void 0, function () {
        var now_2, competitions, compCalendar_1, message, e_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    now_2 = new Date();
                    return [4 /*yield*/, womClient.groups.getGroupCompetitions(groupId)];
                case 1:
                    competitions = _a.sent();
                    compCalendar_1 = [];
                    message = '';
                    competitions.forEach(function (comp) {
                        var startDt = luxon_1.DateTime.fromISO(comp.startsAt.toISOString()).setZone('Europe/London');
                        var endDt = luxon_1.DateTime.fromISO(comp.endsAt.toISOString()).setZone('Europe/London');
                        if ((comp.startsAt < now_2 && comp.endsAt > now_2) || comp.startsAt > now_2) {
                            compCalendar_1.push({
                                title: comp.title,
                                startDt: startDt,
                                endDt: endDt,
                                startDay: startDt.weekdayLong,
                                endDay: endDt.weekdayLong,
                                start: startDt.toFormat('LLL dd'),
                                end: endDt.toFormat('LLL dd'),
                                startTime: startDt.toFormat('HH:mm ZZZZ'),
                                endTime: endDt.toFormat('HH:mm ZZZZ')
                            });
                        }
                    });
                    if (!compCalendar_1.length) {
                        message = "I'm sorry, it seems there are currently no upcoming competitions. Please check again at a later date.";
                    }
                    else {
                        message += "".concat(compCalendar_1
                            .sort(function (a, b) { return a.startDt - b.startDt; })
                            .map(function (comp) {
                            return "**".concat((0, utils_2.toCapitalCase)(comp.startDay), " ").concat(comp.start, " --- ").concat(comp.startTime, "    until    ").concat((0, utils_2.toCapitalCase)(comp.endDay), " ").concat(comp.end, " --- ").concat(comp.endTime, "**\n - ").concat(comp.title);
                        })
                            .join('\n'));
                    }
                    msg.reply(message);
                    return [3 /*break*/, 3];
                case 2:
                    e_5 = _a.sent();
                    (0, handling_1.allCatcher)(e_5, msg);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getCompCalendar = getCompCalendar;
function getPlayerStats(msg, playerName) {
    return __awaiter(this, void 0, void 0, function () {
        var displayName_1, e_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, womClient.players.getPlayerDetails(playerName)];
                case 1:
                    displayName_1 = (_a.sent()).displayName;
                    return [4 /*yield*/, womClient.players.getPlayerDetails(playerName).then(function (json) {
                            var array = Object.values(json.latestSnapshot.data.skills);
                            var output = "Here are the stats for ".concat(displayName_1, ":\n```");
                            array.forEach(function (skill) {
                                var _a;
                                output += "".concat(((0, utils_2.toCapitalCase)(skill.metric) + ': ').padEnd(14)).concat(skill.level
                                    .toString()
                                    .padStart(4), " ").concat((0, utils_2.numberWithCommas)(skill.experience).padStart(12), " Exp   Rank ").concat((0, utils_2.numberWithCommas)(skill.rank).padStart(11), "   ").concat((_a = skill.ehp) === null || _a === void 0 ? void 0 : _a.toFixed(2).padStart(8), " EHP\n");
                            });
                            output += '```';
                            msg.reply(output);
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_6 = _a.sent();
                    (0, handling_1.playerError)(e_6, msg);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getPlayerStats = getPlayerStats;
function getPlayerBossStats(msg, playerName) {
    return __awaiter(this, void 0, void 0, function () {
        var displayName, output_1, e_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, womClient.players.getPlayerDetails(playerName)];
                case 1:
                    displayName = (_a.sent()).displayName;
                    output_1 = "Here are the boss stats for ".concat(displayName, ":\n```");
                    return [4 /*yield*/, womClient.players.getPlayerDetails(playerName).then(function (json) {
                            var array = Object.values(json.latestSnapshot.data.bosses);
                            array.forEach(function (boss) {
                                var _a;
                                output_1 += "".concat((enums_js_1.Bosses[boss.metric] + ': ').padEnd(23)).concat(boss.kills
                                    .toString()
                                    .padStart(6), "  Rank ").concat((0, utils_2.numberWithCommas)(boss.rank).padStart(11), "   ").concat((_a = boss.ehb) === null || _a === void 0 ? void 0 : _a.toFixed(2).padStart(8), " EHB\n");
                            });
                        })];
                case 2:
                    _a.sent();
                    output_1 += '```';
                    msg.reply(output_1);
                    return [3 /*break*/, 4];
                case 3:
                    e_7 = _a.sent();
                    (0, handling_1.playerError)(e_7, msg);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getPlayerBossStats = getPlayerBossStats;
function getPlayerSkillStat(msg, metric, playerName) {
    return __awaiter(this, void 0, void 0, function () {
        var displayName_2, e_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, womClient.players.getPlayerDetails(playerName)];
                case 1:
                    displayName_2 = (_a.sent()).displayName;
                    return [4 /*yield*/, womClient.players.getPlayerDetails(playerName).then(function (json) {
                            var _a;
                            var array = Object.values(json.latestSnapshot.data.skills);
                            var skillStats = array.filter(function (skill) {
                                return skill.metric.toString() === metric;
                            })[0];
                            var message = "Here are the ".concat(enums_js_1.Skills[(0, utils_2.toCapitalCase)(skillStats.metric)], " stats for ").concat(displayName_2, ":\n```Level: ").concat(skillStats.level, "\nExp: ").concat((0, utils_2.numberWithCommas)(skillStats.experience), " Exp\nRank: ").concat((0, utils_2.numberWithCommas)(skillStats.rank), "\nEHP: ").concat((_a = skillStats.ehp) === null || _a === void 0 ? void 0 : _a.toFixed(2), " hours```");
                            msg.reply(message);
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_8 = _a.sent();
                    (0, handling_1.playerError)(e_8, msg);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getPlayerSkillStat = getPlayerSkillStat;
function getPlayerBossStat(msg, metric, playerName) {
    return __awaiter(this, void 0, void 0, function () {
        var displayName_3, e_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, womClient.players.getPlayerDetails(playerName)];
                case 1:
                    displayName_3 = (_a.sent()).displayName;
                    return [4 /*yield*/, womClient.players.getPlayerDetails(playerName).then(function (json) {
                            var _a;
                            var array = Object.values(json.latestSnapshot.data.bosses);
                            var bossStats = array.filter(function (boss) {
                                return boss.metric.toString() === metric;
                            })[0];
                            var message = "Here are the ".concat(enums_js_1.Bosses[bossStats.metric], " stats for ").concat(displayName_3, ":\n```Kills or completions: ").concat((0, utils_2.numberWithCommas)(bossStats.kills), "\nRank: ").concat((0, utils_2.numberWithCommas)(bossStats.rank), "\nEHB: ").concat((_a = bossStats.ehb) === null || _a === void 0 ? void 0 : _a.toFixed(2), " hours```");
                            msg.reply(message);
                        })];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    e_9 = _a.sent();
                    (0, handling_1.playerError)(e_9, msg);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.getPlayerBossStat = getPlayerBossStat;
function getCommands(msg) {
    try {
        var message = "The Degeneration bot supports the following commands:\n```".concat(messages_js_1.COMMAND_MESSAGES.join(''), "\nThe boss_identifier is typically the name of the boss in lowercase, separated by underscores, e.g. thermonuclear_smoke_devil or chambers_of_xeric. We are working on allowing certain common abbreviations as well (e.g. cox or tob or thermy, etc...).```");
        msg.reply(message);
    }
    catch (e) {
        (0, handling_1.allCatcher)(e, msg);
    }
}
exports.getCommands = getCommands;
function getClanRankCalculator(msg) {
    try {
        var attachment = new discord_js_1.AttachmentBuilder('src/public/files/Clan_Rank_Calculator_v3.2.xlsx');
        msg.reply({
            content: 'Here is the Clan Rank Calculator:',
            files: [attachment]
        });
    }
    catch (e) {
        (0, handling_1.allCatcher)(e, msg);
    }
}
exports.getClanRankCalculator = getClanRankCalculator;
function getColResMap(metric, usernames, bossName) {
    if (usernames === void 0) { usernames = []; }
    if (bossName === void 0) { bossName = ''; }
    return __awaiter(this, void 0, void 0, function () {
        var batchSize, curReq, failedUsers, promises, resMap, end, concurrentReq, _loop_1, index;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    batchSize = 70;
                    curReq = 0;
                    failedUsers = [];
                    promises = [];
                    resMap = [];
                    _a.label = 1;
                case 1:
                    if (!(curReq < usernames.length)) return [3 /*break*/, 3];
                    end = usernames.length < curReq + batchSize ? usernames.length : curReq + batchSize;
                    concurrentReq = new Array(batchSize);
                    _loop_1 = function (index) {
                        var promise = axios_1.default
                            .get("https://api.collectionlog.net/collectionlog/user/".concat(usernames[index]))
                            .then(function (res) {
                            try {
                                resMap.push(colLogObjectBuilder(metric, usernames, index, res, bossName));
                            }
                            catch (e) {
                                console.log("".concat(usernames[index], " is missing data, skipping..."));
                                failedUsers.push(usernames[index]);
                            }
                        })
                            .catch(function () {
                            console.log("Unable to find collection log for user ".concat(usernames[index]));
                            failedUsers.push(usernames[index]);
                        });
                        concurrentReq.push(promise);
                        promises.push(promise);
                        console.log("sending request ".concat(curReq, "..."));
                        curReq++;
                    };
                    for (index = curReq; index < end; index++) {
                        _loop_1(index);
                    }
                    console.log("requests ".concat(curReq - batchSize, "-").concat(curReq, " done."));
                    return [4 /*yield*/, Promise.all([waitForMs(5000), Promise.all(concurrentReq)])];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 1];
                case 3:
                    (0, utils_2.logUsernames)(failedUsers.sort());
                    return [4 /*yield*/, Promise.all([promises])];
                case 4:
                    _a.sent();
                    return [2 /*return*/, resMap];
            }
        });
    });
}
exports.getColResMap = getColResMap;
var waitForMs = function (ms) { return new Promise(function (resolve, reject) { return setTimeout(function () { return resolve(); }, ms); }); };
function colLogObjectBuilder(metric, usernames, index, res, bossName) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            try {
                if (metric === 'log') {
                    return [2 /*return*/, {
                            username: usernames[index],
                            accountType: res.data.collectionLog.accountType,
                            totalObtained: res.data.collectionLog.totalObtained,
                            totalItems: res.data.collectionLog.totalItems,
                            uniqueObtained: res.data.collectionLog.uniqueObtained
                        }];
                }
                if (metric === 'pets') {
                    return [2 /*return*/, {
                            username: usernames[index],
                            pets: res.data.collectionLog.tabs.Other['All Pets'].items.filter(function (i) {
                                return i.obtained;
                            }).length
                        }];
                }
            }
            catch (e) {
                console.log("".concat(usernames[index], " is missing data, skipping..."));
            }
            return [2 /*return*/];
        });
    });
}
function getResults(msg, compId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var winner_1, secondPlace_1, e_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, womClient.competitions
                            .getCompetitionDetails(compId)
                            .then(function (json) {
                            var output = (0, utils_2.top5members)(json);
                            winner_1 = output[0].player.displayName;
                            secondPlace_1 = output[1].player.displayName;
                            return output;
                        })
                            .then(function (json) { return (0, utils_2.jsonToOutput)(json, type); })
                            .then(function (res) {
                            var message = "Here are the results for the ".concat(type === 'sotw' ? 'Skill of the Week' : 'Boss of the Week', " competition:\n");
                            message += "```".concat(res.join('\n'), "```");
                            message += "\nThank you to everyone who took part!\n".concat(winner_1, " gets 2 bonds for winning, ").concat(secondPlace_1, " gets 1 for coming in second place. Please contact any admin or leader for the payout.\n\nHappy scaping and we hope to see you all compete in the next event!");
                            msg.reply(message);
                        })];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    e_10 = _a.sent();
                    (0, handling_1.incorrectId)(e_10, msg);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getResults = getResults;
function getBalance(msg, username) {
    return __awaiter(this, void 0, void 0, function () {
        var points, message, e_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, points_1.getPointsByUsername)(username)];
                case 1:
                    points = _a.sent();
                    message = '';
                    if (points !== undefined) {
                        message = "The current balance for ".concat(username, " is: ").concat(points, " Regencoin").concat(parseInt(points) === 1 ? '' : 's');
                    }
                    else {
                        message = "No balance was found for ".concat(username, ". If you are sure you spelled the username correctly, please contact Belgiska. Alternatively, try the command again (sometimes it noodles out).");
                    }
                    msg.reply(message);
                    return [3 /*break*/, 3];
                case 2:
                    e_11 = _a.sent();
                    (0, handling_1.allCatcher)(e_11, msg);
                    console.log(e_11);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getBalance = getBalance;
function getPetsOrLogTopTen(msg, groupId, metric) {
    return __awaiter(this, void 0, void 0, function () {
        var usernames, resArray, arrayOfObjects, sortedResArray, arrayOfObjects, sortedResArray;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getAllDisplayNames(groupId)];
                case 1:
                    usernames = _a.sent();
                    msg.reply("Please wait while I fetch the top 10 for the metric \"".concat(metric, "\". (approx. ").concat(((((usernames === null || usernames === void 0 ? void 0 : usernames.length) || 30) / 30 + 1) *
                        5).toFixed(0), " secs.)"));
                    return [4 /*yield*/, getColResMap(metric, usernames)];
                case 2:
                    resArray = _a.sent();
                    if (!(metric === 'pets')) return [3 /*break*/, 5];
                    return [4 /*yield*/, Promise.all(resArray)];
                case 3:
                    arrayOfObjects = (_a.sent());
                    sortedResArray = arrayOfObjects.sort(function (a, b) { return b.pets - a.pets; });
                    return [4 /*yield*/, Promise.all(sortedResArray)];
                case 4:
                    _a.sent();
                    msg.reply((0, utils_2.buildMessage)(sortedResArray, metric));
                    return [3 /*break*/, 8];
                case 5: return [4 /*yield*/, Promise.all(resArray)];
                case 6:
                    arrayOfObjects = (_a.sent());
                    sortedResArray = arrayOfObjects.sort(function (a, b) { return b.uniqueObtained - a.uniqueObtained; });
                    return [4 /*yield*/, Promise.all(sortedResArray)];
                case 7:
                    _a.sent();
                    msg.reply((0, utils_2.buildMessage)(sortedResArray, metric));
                    _a.label = 8;
                case 8:
                    console.log('\nBatch process finished.');
                    return [2 /*return*/];
            }
        });
    });
}
exports.getPetsOrLogTopTen = getPetsOrLogTopTen;
