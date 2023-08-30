"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
var discord_js_1 = require("discord.js");
var wom_js_1 = require("./scripts/wom.js");
var http = require("http");
var messages_js_1 = require("./constants/messages.js");
var bingo_js_1 = require("./scripts/bingo.js");
http
    .createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
})
    .listen(8000);
var GROUP_ID = process.env.GROUP_ID;
var client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent,
        discord_js_1.GatewayIntentBits.GuildMembers
    ]
});
client.on('ready', function () {
    var _a;
    console.log("Logged in as ".concat((_a = client.user) === null || _a === void 0 ? void 0 : _a.tag, "!"));
    var activities = messages_js_1.ACTIVITIES, i = 0;
    setInterval(function () { var _a; return (_a = client.user) === null || _a === void 0 ? void 0 : _a.setActivity("".concat(activities[i++ % activities.length])); }, 10000 * 60 * 5);
});
client.on('messageCreate', function (msg) {
    var _a, _b, _c;
    if (msg.author.bot)
        return;
    var groupId = GROUP_ID;
    var args = msg.content.trim().split(/ +/g);
    var command = (_a = args.shift()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
    var playerName;
    var skill;
    var boss;
    switch (command) {
        case '!help':
        case '/help':
        case '?help':
            (0, wom_js_1.getCommands)(msg);
            break;
        case '?calc':
            (0, wom_js_1.getClanRankCalculator)(msg);
            break;
        case '?sotw':
            (0, wom_js_1.getResults)(msg, parseInt(args[0]), 'sotw');
            break;
        case '?botw':
            (0, wom_js_1.getResults)(msg, parseInt(args[0]), 'botw');
            break;
        case '?comps':
            (0, wom_js_1.getGroupCompetitions)(msg, groupId);
            break;
        case '?calendar':
            (0, wom_js_1.getCompCalendar)(msg, groupId);
            break;
        case '?ttm':
            (0, wom_js_1.getTopTen)(msg, groupId, 'ttm');
            break;
        case '?exp':
            (0, wom_js_1.getTopTen)(msg, groupId, 'exp');
            break;
        case '?ehb':
            (0, wom_js_1.getTopTen)(msg, groupId, 'ehb');
            break;
        case '?ehp':
            (0, wom_js_1.getTopTen)(msg, groupId, 'ehp');
            break;
        case '?rgn':
            (0, wom_js_1.getTopTen)(msg, groupId, 'balance');
            break;
        case '?month':
            var monthArg = args.shift();
            var yearArg = args.shift();
            var month = monthArg && !isNaN(parseInt(monthArg)) ? parseInt(monthArg) : undefined;
            var year = yearArg && !isNaN(parseInt(yearArg)) ? parseInt(yearArg) : undefined;
            (0, wom_js_1.getMonthlyGains)(msg, groupId, { month: month, year: year });
            break;
        // Not necessary, old school bot already has a similar, better feature
        // case "?stats":
        //     playerName = args.join(" ").toString();
        //     getPlayerStats(msg, playerName);
        //     break;
        // Response body is too big, can't split it up, so unusable
        // case "?bosses":
        //     playerName = args.join(" ").toString();
        //     getPlayerBossStats(msg, playerName);
        //     break;
        case '?lvl':
            skill = (_b = args.shift()) === null || _b === void 0 ? void 0 : _b.toLowerCase();
            playerName = args.join(' ').toString();
            (0, wom_js_1.getPlayerSkillStat)(msg, skill, playerName);
            break;
        case '?kc':
            boss = (_c = args.shift()) === null || _c === void 0 ? void 0 : _c.toLowerCase();
            playerName = args.join(' ').toString();
            (0, wom_js_1.getPlayerBossStat)(msg, boss, playerName);
            break;
        case '?log':
            (0, wom_js_1.getTopTen)(msg, groupId, 'log');
            break;
        case '?pets':
            (0, wom_js_1.getTopTen)(msg, groupId, 'pets');
            break;
        case '?balance':
            playerName = args.join(' ').toString();
            (0, wom_js_1.getBalance)(msg, playerName);
            break;
        case '?roll':
            (0, bingo_js_1.getDiceRoll)(msg);
        default:
            break;
    }
});
//
//
//
//KEEP LAST
client.login(process.env.CLIENT_TOKEN);
