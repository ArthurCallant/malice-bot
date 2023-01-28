import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import {
    getGroupCompetitions,
    getResults,
    getTopTenTtm,
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
            getGroupCompetitions(msg, 755);
            break;
        case "top10ttm":
            getTopTenTtm(msg, 4089);
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
