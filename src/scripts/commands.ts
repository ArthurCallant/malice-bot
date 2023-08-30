import { Message } from 'discord.js';
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
} from './wom';
import { getDiceRoll } from './bingo';

export function adminCommands(msg: Message, command: string, args: string[]) {
  switch (command) {
    case '?sotw':
      getResults(msg, parseInt(args[0]), 'sotw');
      break;
    case '?botw':
      getResults(msg, parseInt(args[0]), 'botw');
      break;
    case '?ttm':
      getTopTen(msg, 'ttm');
      break;
    case '?exp':
      getTopTen(msg, 'exp');
      break;
    case '?ehb':
      getTopTen(msg, 'ehb');
      break;
    case '?ehp':
      getTopTen(msg, 'ehp');
      break;
    case '?rgn':
      getTopTen(msg, 'balance');
      break;
    case '?month':
      const monthArg = args.shift();
      const yearArg = args.shift();
      const month = monthArg && !isNaN(parseInt(monthArg)) ? parseInt(monthArg) : undefined;
      const year = yearArg && !isNaN(parseInt(yearArg)) ? parseInt(yearArg) : undefined;
      getMonthlyGains(msg, { month: month, year: year });
      break;
    case '?log':
      getTopTen(msg, 'log');
      break;
    case '?pets':
      getTopTen(msg, 'pets');
      break;
    default:
      standardUserCommands(msg, command, args);
      break;
  }
}

export function standardUserCommands(msg: Message, command: string, args: string[]) {
  let playerName;
  let skill;
  let boss;
  switch (command) {
    case '!help':
    case '/help':
    case '?help':
      // TODO explain changes to permissions, and that certain users can't use certain commands anymore
      getCommands(msg);
      break;
    case '?calc':
      getClanRankCalculator(msg);
      break;
    case '?comps':
      getGroupCompetitions(msg);
      break;
    case '?calendar':
      getCompCalendar(msg);
      break;
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
    case '?balance':
      playerName = args.join(' ').toString();
      getBalance(msg, playerName);
      break;
    case '?roll':
      getDiceRoll(msg);
    default:
      break;
  }
}
