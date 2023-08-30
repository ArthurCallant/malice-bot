import * as dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits, Message, TextChannel } from 'discord.js';
import * as http from 'http';
import { ACTIVITIES } from './constants/messages.js';
import { getDiceRoll } from './scripts/bingo.js';
import { isAuthorAdmin } from './scripts/utils/roles.utils.js';
import { adminCommands, standardUserCommands } from './scripts/commands.js';

http
  .createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
  })
  .listen(8000);

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ]
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`);
  let activities = ACTIVITIES,
    i = 0;
  setInterval(() => client.user?.setActivity(`${activities[i++ % activities.length]}`), 10000 * 60 * 5);
});

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return;

  const args = msg.content.trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();

  const channelId = msg.channelId;
  const channel: TextChannel = client.channels.cache.get(channelId) as TextChannel;
  const channelName = channel.name;

  const isAdmin = isAuthorAdmin(msg);

  // if (channelName === 'spoiler-free-bot-channel' && isAdmin) {
  //   if (command !== '?roll') {
  //     msg.reply('Sorry, you can only use the ?roll command in this channel');
  //     return;
  //   } else {
  //     getDiceRoll(msg);
  //   }
  // }
  if (isAdmin) {
    adminCommands(msg, command, args);
  } else {
    standardUserCommands(msg, command, args);
  }
});

//
//
//
//KEEP LAST
client.login(process.env.CLIENT_TOKEN);
