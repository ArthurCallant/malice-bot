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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGroupGains = exports.getStartToEndPeriod = exports.logUsernames = exports.buildMessage = exports.formatDisplayNameForTopTen = exports.sortMembershipsByMetric = exports.rollDice = exports.toCapitalCase = exports.jsonToOutput = exports.top5members = exports.numberWithCommas = void 0;
var blacklist_1 = require("../../constants/blacklist");
var fs_1 = require("fs");
var luxon_1 = require("luxon");
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
exports.numberWithCommas = numberWithCommas;
function top5members(json) {
    return __spreadArray([], json['participations'], true).sort(function (playerA, playerB) { return parseInt(playerA['progress'].toString()) - parseInt(playerB['progress'].toString()); })
        .slice(0, 5);
}
exports.top5members = top5members;
function jsonToOutput(json, type) {
    var suffix = type === 'sotw' ? 'exp' : 'kills';
    return json.map(function (p, i) {
        return "RANK ".concat(i + 1, ": ").concat(p['player']['displayName'], " with ").concat(numberWithCommas(p['progress']['gained']), " ").concat(suffix);
    });
}
exports.jsonToOutput = jsonToOutput;
function toCapitalCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
exports.toCapitalCase = toCapitalCase;
function rollDice() {
    return Math.floor(Math.random() * 7);
}
exports.rollDice = rollDice;
function sortMembershipsByMetric(memberships, metric) {
    switch (metric) {
        case 'ttm':
            return memberships.sort(function (a, b) { return a.player.ttm - b.player.ttm; }).filter(function (a) { return a.player.ttm !== 0; });
        case 'exp':
        case 'ehb':
        case 'ehp':
            return memberships.sort(function (a, b) { return b.player[metric] - a.player[metric]; });
        default:
            throw new Error('Invalid metric provided.');
    }
}
exports.sortMembershipsByMetric = sortMembershipsByMetric;
function formatDisplayNameForTopTen(position, username) {
    return "".concat(((position + 1).toString() + '.').padEnd(3), " ").concat(username.padEnd(12));
}
exports.formatDisplayNameForTopTen = formatDisplayNameForTopTen;
function buildMessage(sortedMemberships, metric, options) {
    if (options === void 0) { options = {}; }
    var message = 'The following players are the members of Regeneration that ';
    switch (metric) {
        case 'ttm':
            message += "are closest to maxing:\n```".concat(sortedMemberships
                .map(function (m, i) {
                return "".concat(formatDisplayNameForTopTen(i, m.player.displayName), ": ").concat((m.player.ttm.toFixed(2) + ' hours left.').padStart(18));
            })
                .join('\n'), "```");
            break;
        case 'exp':
            message += "have the highest amount of Exp:\n```".concat(sortedMemberships
                .map(function (m, i) {
                return "".concat(formatDisplayNameForTopTen(i, m.player.displayName), ": ").concat((numberWithCommas(m.player.exp) + ' Exp.').padStart(18));
            })
                .join('\n'), "```");
            break;
        case 'ehb':
            message += "have the highest amount of Efficient Hours Bossed:\n```".concat(sortedMemberships
                .map(function (m, i) {
                return "".concat(formatDisplayNameForTopTen(i, m.player.displayName), ": ").concat((m.player.ehb.toFixed(2) + ' EHB.').padStart(15));
            })
                .join('\n'), "```");
            break;
        case 'ehp':
            message += "have the highest amount of Efficient Hours Played:\n```".concat(sortedMemberships
                .map(function (m, i) {
                return "".concat(formatDisplayNameForTopTen(i, m.player.displayName), ": ").concat((m.player.ehp.toFixed(2) + ' EHP.').padStart(15));
            })
                .join('\n'), "```");
            break;
        case 'log':
            message += "have the highest amount of unique Collection Log slots:\n```".concat(sortedMemberships
                .slice(0, 10)
                .map(function (user, index) {
                return "".concat(formatDisplayNameForTopTen(index, user.username), ": ").concat((user.uniqueObtained + '  collection log slots.').padStart(18));
            })
                .join('\n'), "```");
            break;
        case 'pets':
            message += "have the highest amount of unique pets:\n```".concat(sortedMemberships
                .slice(0, 10)
                .map(function (user, index) {
                return "".concat(formatDisplayNameForTopTen(index, user.username), ": ").concat((Math.trunc(user.pets).toFixed(2) + ' pets.').padStart(8));
            })
                .join('\n'), "```");
            break;
        case 'balance':
            message += "have the highest amount of Regencoins:\n```".concat(sortedMemberships
                .map(function (user, index) {
                return "".concat(formatDisplayNameForTopTen(index, user.username), ": ").concat((Math.trunc(user.points) + ' Regencoins.').padStart(10));
            })
                .join('\n'), "```");
            break;
        case 'month':
            message = "Here is the monthly leaderboard results for ".concat(options.sdString, " - ").concat(options.edString, ":\n\n      Overall EXP:\n```").concat(options.expStats &&
                options.expStats
                    .filter(function (user) { return !blacklist_1.BLACKLIST.includes(user.username); })
                    .slice(0, 10)
                    .map(function (m, i) {
                    return "".concat(formatDisplayNameForTopTen(i, m.username), ": ").concat((numberWithCommas(m.gained) + ' Exp.').padStart(18));
                })
                    .join('\n'), "```\n      EHB:\n```").concat(options.ehbStats &&
                options.ehbStats
                    .filter(function (user) { return !blacklist_1.BLACKLIST.includes(user.username); })
                    .slice(0, 10)
                    .map(function (m, i) {
                    return "".concat(formatDisplayNameForTopTen(i, m.username), ": ").concat((m.gained.toFixed(2) + ' EHB.').padStart(15));
                })
                    .join('\n'), "```\n      EHP:\n```").concat(options.ehpStats &&
                options.ehpStats
                    .filter(function (user) { return !blacklist_1.BLACKLIST.includes(user.username); })
                    .slice(0, 10)
                    .map(function (m, i) {
                    return "".concat(formatDisplayNameForTopTen(i, m.username), ": ").concat((m.gained.toFixed(2) + ' EHP.').padStart(15));
                })
                    .join('\n'), "```\n      ");
        default:
            break;
    }
    return message;
}
exports.buildMessage = buildMessage;
function logUsernames(usernames) {
    var output = usernames.join('\n');
    (0, fs_1.writeFile)('src/public/logs/usernames_log.txt', output, function (err) {
        if (err) {
            console.log(err);
            return;
        }
        console.log('A file has been created with errorred usernames');
    });
}
exports.logUsernames = logUsernames;
function getCurrentDateObject() {
    var date = luxon_1.DateTime.now();
    var month = date.month;
    var year = date.year;
    return {
        month: month,
        year: year
    };
}
function getStartToEndPeriod(_a) {
    var _b = _a.day, day = _b === void 0 ? 1 : _b, _c = _a.month, month = _c === void 0 ? getCurrentDateObject().month : _c, _d = _a.year, year = _d === void 0 ? getCurrentDateObject().year : _d;
    var startDate = luxon_1.DateTime.fromObject({ day: day, month: month, year: year });
    var endDate = startDate.endOf('month');
    return {
        startDate: startDate.toISO(),
        endDate: endDate.toISO()
    };
}
exports.getStartToEndPeriod = getStartToEndPeriod;
function fetchGroupGains(womClient, groupId, gainsPeriod, metric) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, womClient.groups
                        .getGroupGains(groupId, { startDate: gainsPeriod.startDate, endDate: gainsPeriod.endDate, metric: metric }, { limit: 20 })
                        .then(function (result) {
                        return result.map(function (p) {
                            return {
                                username: p.player.displayName,
                                gained: p.data.gained
                            };
                        });
                    })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.fetchGroupGains = fetchGroupGains;
