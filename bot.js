import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import {
    getGroupCompetitions,
    getPlayerSkillStat,
    getPlayerStats,
    getResults,
    getTopTen,
} from "./scripts/wom.js";

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
    const args = msg.content.slice(1).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    switch (command) {
        case "sotw":
            getResults(msg, args[0], "sotw");
            break;
        case "botw":
            getResults(msg, args[0], "botw");
            break;
        case "comps":
            getGroupCompetitions(msg, process.env.GROUP_ID);
            break;
        case "ttm":
            getTopTen(msg, process.env.GROUP_ID, "ttm");
            break;
        case "exp":
            getTopTen(msg, process.env.GROUP_ID, "exp");
            break;
        case "ehb":
            getTopTen(msg, process.env.GROUP_ID, "ehb");
            break;
        case "ehp":
            getTopTen(msg, process.env.GROUP_ID, "ehp");
            break;
        case "stats":
            const playerName = args.join(" ").toString();
            getPlayerStats(msg, playerName);
            break;
        case "stat":
            const skill = args.shift().toLowerCase();
            const player = args.join(" ").toString();
            getPlayerSkillStat(msg, skill, player);
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
