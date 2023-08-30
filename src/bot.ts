import * as dotenv from 'dotenv';
dotenv.config();
import { Client, GatewayIntentBits } from 'discord.js';
import {
  getBalance,
  getClanRankCalculator,
  getCommands,
  getCompCalendar,
  getGroupCompetitions,
  getMonthlyGains,
  getPlayerBossStat,
  getPlayerSkillStat,
  getResults,
  getTopTen
} from './scripts/wom.js';
import * as http from 'http';
import { ACTIVITIES } from './constants/messages.js';
import { getDiceRoll } from './scripts/bingo.js';

http
  .createServer(function (req, res) {
    res.write("I'm alive");
    res.end();
  })
  .listen(8000);

const GROUP_ID = process.env.GROUP_ID;

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
  const groupId: number = GROUP_ID as unknown as number;
  const args = msg.content.trim().split(/ +/g);
  const command = args.shift()?.toLowerCase();
  let playerName;
  let skill;
  let boss;
  switch (command) {
    case '!help':
    case '/help':
    case '?help':
      getCommands(msg);
      break;
    case '?calc':
      getClanRankCalculator(msg);
      break;
    case '?sotw':
      getResults(msg, parseInt(args[0]), 'sotw');
      break;
    case '?botw':
      getResults(msg, parseInt(args[0]), 'botw');
      break;
    case '?comps':
      getGroupCompetitions(msg, groupId);
      break;
    case '?calendar':
      getCompCalendar(msg, groupId);
      break;
    case '?ttm':
      getTopTen(msg, groupId, 'ttm');
      break;
    case '?exp':
      getTopTen(msg, groupId, 'exp');
      break;
    case '?ehb':
      getTopTen(msg, groupId, 'ehb');
      break;
    case '?ehp':
      getTopTen(msg, groupId, 'ehp');
      break;
    case '?rgn':
      getTopTen(msg, groupId, 'balance');
      break;
    case '?month':
      const monthArg = args.shift();
      const yearArg = args.shift();
      const month = monthArg && !isNaN(parseInt(monthArg)) ? parseInt(monthArg) : undefined;
      const year = yearArg && !isNaN(parseInt(yearArg)) ? parseInt(yearArg) : undefined;
      getMonthlyGains(msg, groupId, { month: month, year: year });
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
      skill = args.shift()?.toLowerCase();
      playerName = args.join(' ').toString();
      getPlayerSkillStat(msg, skill, playerName);
      break;
    case '?kc':
      boss = args.shift()?.toLowerCase();
      playerName = args.join(' ').toString();
      getPlayerBossStat(msg, boss, playerName);
      break;
    case '?log':
      getTopTen(msg, groupId, 'log');
      break;
    case '?pets':
      getTopTen(msg, groupId, 'pets');
      break;
    case '?balance':
      playerName = args.join(' ').toString();
      getBalance(msg, playerName);
      break;
    case '?roll':
      getDiceRoll(msg);
    default:
      break;
  }
});

//
//
//
//KEEP LAST
client.login(process.env.CLIENT_TOKEN);