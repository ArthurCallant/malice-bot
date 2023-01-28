import dotenv from "dotenv";
dotenv.config();
import { Client, GatewayIntentBits } from "discord.js";
import { getSotwResults, getBotwResults } from "./scripts/wom.js";

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
            getSotwResults(msg, args[0]);
            break;
        case "botw":
            getBotwResults(msg, args[0]);
            break;
        default:
            break;
    }
});

//make sure this line is the last line
client.login(process.env.CLIENT_TOKEN); //login bot using token
