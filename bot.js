import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import {
    getClanRankCalculator,
    getCommands,
    getCompCalendar,
    getGroupCompetitions,
    getPlayerBossStat,
    getPlayerSkillStat,
    getResults,
    getTopTen,
} from "./scripts/wom.js";

const groupId = process.env.GROUP_ID;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on("messageCreate", (msg) => {
    if (msg.author.bot) return;
    const args = msg.content.trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let playerName;
    let skill;
    let boss;
    switch (command) {
        case "!help":
        case "/help":
        case "?help":
            getCommands(msg);
            break;
        case "?calc":
            getClanRankCalculator(msg);
            break;
        case "?sotw":
            getResults(msg, args[0], "sotw");
            break;
        case "?botw":
            getResults(msg, args[0], "botw");
            break;
        case "?comps":
            getGroupCompetitions(msg, groupId);
            break;
        case "?calendar":
            getCompCalendar(msg, groupId);
            break;
        case "?ttm":
            getTopTen(msg, groupId, "ttm");
            break;
        case "?exp":
            getTopTen(msg, groupId, "exp");
            break;
        case "?ehb":
            getTopTen(msg, groupId, "ehb");
            break;
        case "?ehp":
            getTopTen(msg, groupId, "ehp");
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
        case "?lvl":
            skill = args.shift().toLowerCase();
            playerName = args.join(" ").toString();
            getPlayerSkillStat(msg, skill, playerName);
            break;
        case "?kc":
            boss = args.shift().toLowerCase();
            playerName = args.join(" ").toString();
            getPlayerBossStat(msg, boss, playerName);
            break;
        case "?log":
            getTopTen(msg, groupId, "log");
            break;
        case "?pets":
            getTopTen(msg, groupId, "pets");
            break;
        default:
            break;
    }
});

//
//
//
//KEEP LAST
client.login(process.env.CLIENT_TOKEN);
