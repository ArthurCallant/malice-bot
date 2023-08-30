import { WOMClient, CompetitionDetails } from '@wise-old-man/utils';
import axios from 'axios';
import { Bosses, Skills } from '../constants/enums.js';
import { allCatcher, incorrectId, playerError, topTenError } from './errors/handling';
import {
  buildMessage,
  jsonToOutput,
  sortMembershipsByMetric,
  top5members,
  numberWithCommas,
  toCapitalCase,
  logUsernames,
  getStartToEndPeriod,
  fetchGroupGains
} from './utils/utils';
import { getAllPointsSorted, getPointsByUsername } from './points';
import { AttachmentBuilder, Message } from 'discord.js';
import { COMMAND_MESSAGES } from '../constants/messages.js';
import { DateTime } from 'luxon';
import { BLACKLIST } from '../constants/blacklist';
import {
  CompetitionCalendar,
  Period,
  TopTenMetric,
  Type,
  UserWithLogSlots,
  UserWithPets
} from '../constants/application.types';

const womClient = new WOMClient();

export async function getAllDisplayNames(groupId: number) {
  try {
    const memberships = (await womClient.groups.getGroupDetails(groupId)).memberships;
    const displayNames = memberships.map((p) => {
      return p.player.displayName;
    });
    return displayNames.filter((name) => !BLACKLIST.includes(name));
  } catch (e) {
    allCatcher(e);
  }
}

export async function getTopTen(msg: Message, groupId: number, metric: TopTenMetric) {
  try {
    switch (metric) {
      case 'pets':
      case 'log':
        getPetsOrLogTopTen(msg, groupId, metric);
        break;
      case 'balance':
        const sortedPointsArray = (await getAllPointsSorted())
          .filter((user) => !BLACKLIST.includes(user.username))
          .slice(0, 10);
        msg.reply(buildMessage(sortedPointsArray, metric));
        break;
      default:
        const memberships = (await womClient.groups.getGroupDetails(groupId)).memberships;
        const sortedMemberships = sortMembershipsByMetric(memberships, metric)
          .filter((user) => !BLACKLIST.includes(user.player.displayName))
          .slice(0, 10);
        msg.reply(buildMessage(sortedMemberships, metric));
        break;
    }
  } catch (e) {
    topTenError(e, msg);
  }
}

export async function getMonthlyGains(msg: Message, groupId: number, periodObject = {}) {
  try {
    const gainsPeriod: Period = getStartToEndPeriod(periodObject);

    const sdString = DateTime.fromISO(gainsPeriod.startDate).toFormat('d LLLL yyyy');
    const edString = DateTime.fromISO(gainsPeriod.endDate).toFormat('d LLLL yyyy');

    const ehbStats = await fetchGroupGains(womClient, groupId, gainsPeriod, 'ehb');
    const ehpStats = await fetchGroupGains(womClient, groupId, gainsPeriod, 'ehp');
    const expStats = await fetchGroupGains(womClient, groupId, gainsPeriod, 'overall');

    const message = buildMessage([], 'month', {
      sdString: sdString,
      edString: edString,
      expStats: expStats,
      ehbStats: ehbStats,
      ehpStats: ehpStats
    });
    msg.reply(message);
  } catch (e) {
    allCatcher(e, msg);
  }
}

export async function getGroupCompetitions(msg: Message, groupId: number) {
  try {
    const now = new Date();
    const ongoingComps: string[] = [];
    const futureComps: string[] = [];
    const competitions = await womClient.groups.getGroupCompetitions(groupId);
    let message = '';

    competitions.forEach((comp) => {
      if (comp.startsAt < now && comp.endsAt > now) {
        ongoingComps.push(comp.title);
      } else if (comp.startsAt > now) {
        futureComps.push(comp.title);
      }
    });

    ongoingComps.length > 0
      ? (message += `The ongoing competitions are: ${ongoingComps
          .map((c) => {
            return `${c}`;
          })
          .join(', ')}`)
      : (message += 'There are currently no ongoing competitions');

    futureComps.length > 0
      ? (message += `The future competitions are: ${futureComps
          .map((c) => {
            return `${c}`;
          })
          .join(', ')}`)
      : (message += '\n\nThere are currently no future competitions');

    msg.reply(message);
  } catch (e) {
    allCatcher(e, msg);
  }
}

export async function getCompCalendar(msg: Message, groupId: number) {
  try {
    const now = new Date();
    const competitions = await womClient.groups.getGroupCompetitions(groupId);
    const compCalendar: CompetitionCalendar[] = [];
    let message = '';

    competitions.forEach((comp) => {
      const startDt = DateTime.fromISO(comp.startsAt.toISOString()).setZone('Europe/London');
      const endDt = DateTime.fromISO(comp.endsAt.toISOString()).setZone('Europe/London');

      if ((comp.startsAt < now && comp.endsAt > now) || comp.startsAt > now) {
        compCalendar.push({
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

    if (!compCalendar.length) {
      message = "I'm sorry, it seems there are currently no upcoming competitions. Please check again at a later date.";
    } else {
      message += `${compCalendar
        .sort((a, b) => a.startDt - b.startDt)
        .map((comp) => {
          return `**${toCapitalCase(comp.startDay)} ${comp.start} --- ${comp.startTime}    until    ${toCapitalCase(
            comp.endDay
          )} ${comp.end} --- ${comp.endTime}**\n - ${comp.title}`;
        })
        .join('\n')}`;
    }

    msg.reply(message);
  } catch (e) {
    allCatcher(e, msg);
  }
}

export async function getPlayerStats(msg: Message, playerName: string) {
  try {
    const displayName = (await womClient.players.getPlayerDetails(playerName)).displayName;

    await womClient.players.getPlayerDetails(playerName).then((json) => {
      const array = Object.values(json.latestSnapshot.data.skills);
      let output = `Here are the stats for ${displayName}:\n\`\`\``;

      array.forEach((skill) => {
        output += `${(toCapitalCase(skill.metric) + ': ').padEnd(14)}${skill.level
          .toString()
          .padStart(4)} ${numberWithCommas(skill.experience).padStart(12)} Exp   Rank ${numberWithCommas(
          skill.rank
        ).padStart(11)}   ${skill.ehp?.toFixed(2).padStart(8)} EHP\n`;
      });

      output += '```';

      msg.reply(output);
    });
  } catch (e) {
    playerError(e, msg);
  }
}

export async function getPlayerBossStats(msg: Message, playerName: string) {
  try {
    const displayName = (await womClient.players.getPlayerDetails(playerName)).displayName;
    let output = `Here are the boss stats for ${displayName}:\n\`\`\``;

    await womClient.players.getPlayerDetails(playerName).then((json) => {
      const array = Object.values(json.latestSnapshot.data.bosses);
      array.forEach((boss) => {
        output += `${(Bosses[boss.metric] + ': ').padEnd(23)}${boss.kills
          .toString()
          .padStart(6)}  Rank ${numberWithCommas(boss.rank).padStart(11)}   ${boss.ehb?.toFixed(2).padStart(8)} EHB\n`;
      });
    });

    output += '```';

    msg.reply(output);
  } catch (e) {
    playerError(e, msg);
  }
}

export async function getPlayerSkillStat(msg: Message, metric: string, playerName: string) {
  try {
    const displayName = (await womClient.players.getPlayerDetails(playerName)).displayName;

    await womClient.players.getPlayerDetails(playerName).then((json) => {
      const array = Object.values(json.latestSnapshot.data.skills);
      const skillStats = array.filter((skill) => {
        return skill.metric.toString() === metric;
      })[0];

      let message = `Here are the ${Skills[toCapitalCase(skillStats.metric)]} stats for ${displayName}:\n\`\`\`Level: ${
        skillStats.level
      }\nExp: ${numberWithCommas(skillStats.experience)} Exp\nRank: ${numberWithCommas(
        skillStats.rank
      )}\nEHP: ${skillStats.ehp?.toFixed(2)} hours\`\`\``;

      msg.reply(message);
    });
  } catch (e) {
    playerError(e, msg);
  }
}

export async function getPlayerBossStat(msg: Message, metric: string, playerName: string) {
  try {
    const displayName = (await womClient.players.getPlayerDetails(playerName)).displayName;

    await womClient.players.getPlayerDetails(playerName).then((json) => {
      const array = Object.values(json.latestSnapshot.data.bosses);
      const bossStats = array.filter((boss) => {
        return boss.metric.toString() === metric;
      })[0];

      let message = `Here are the ${
        Bosses[bossStats.metric]
      } stats for ${displayName}:\n\`\`\`Kills or completions: ${numberWithCommas(
        bossStats.kills
      )}\nRank: ${numberWithCommas(bossStats.rank)}\nEHB: ${bossStats.ehb?.toFixed(2)} hours\`\`\``;

      msg.reply(message);
    });
  } catch (e) {
    playerError(e, msg);
  }
}

export function getCommands(msg: Message) {
  try {
    const message = `The Degeneration bot supports the following commands:\n\`\`\`${COMMAND_MESSAGES.join(
      ''
    )}\nThe boss_identifier is typically the name of the boss in lowercase, separated by underscores, e.g. thermonuclear_smoke_devil or chambers_of_xeric. We are working on allowing certain common abbreviations as well (e.g. cox or tob or thermy, etc...).\`\`\``;

    msg.reply(message);
  } catch (e) {
    allCatcher(e, msg);
  }
}

export function getClanRankCalculator(msg: Message) {
  try {
    const attachment = new AttachmentBuilder('src/public/files/Clan_Rank_Calculator_v3.2.xlsx');

    msg.reply({
      content: 'Here is the Clan Rank Calculator:',
      files: [attachment]
    });
  } catch (e) {
    allCatcher(e, msg);
  }
}

export async function getColResMap(metric: 'pets' | 'log', usernames: string[] = [], bossName = '') {
  const batchSize = 70; // tweak this number if api fails (set it lower and wait a couple of mins before trying again)
  let curReq = 0;

  // Collect failed fetch usernames
  const failedUsers: string[] = [];

  const promises: Object[] = [];
  const resMap: Object[] = [];
  while (curReq < usernames.length) {
    const end = usernames.length < curReq + batchSize ? usernames.length : curReq + batchSize;
    const concurrentReq = new Array(batchSize);

    for (let index = curReq; index < end; index++) {
      const promise = axios
        .get(`https://api.collectionlog.net/collectionlog/user/${usernames[index]}`)
        .then((res) => {
          try {
            resMap.push(colLogObjectBuilder(metric, usernames, index, res, bossName));
          } catch (e) {
            console.log(`${usernames[index]} is missing data, skipping...`);
            failedUsers.push(usernames[index]);
          }
        })
        .catch(() => {
          console.log(`Unable to find collection log for user ${usernames[index]}`);
          failedUsers.push(usernames[index]);
        });
      concurrentReq.push(promise);
      promises.push(promise);
      console.log(`sending request ${curReq}...`);
      curReq++;
    }
    console.log(`requests ${curReq - batchSize}-${curReq} done.`);
    await Promise.all([waitForMs(5000), Promise.all(concurrentReq)]);
  }
  logUsernames(failedUsers.sort());
  await Promise.all([promises]);
  return resMap;
}

const waitForMs = (ms: number) => new Promise<void>((resolve, reject) => setTimeout(() => resolve(), ms));

async function colLogObjectBuilder(metric: 'pets' | 'log', usernames: string[], index: number, res, bossName: string) {
  try {
    if (metric === 'log') {
      return {
        username: usernames[index],
        accountType: res.data.collectionLog.accountType,
        totalObtained: res.data.collectionLog.totalObtained,
        totalItems: res.data.collectionLog.totalItems,
        uniqueObtained: res.data.collectionLog.uniqueObtained
      };
    }
    if (metric === 'pets') {
      return {
        username: usernames[index],
        pets: res.data.collectionLog.tabs.Other['All Pets'].items.filter((i) => {
          return i.obtained;
        }).length
      };
    }
  } catch (e) {
    console.log(`${usernames[index]} is missing data, skipping...`);
  }
}

export async function getResults(msg: Message, compId: number, type: Type) {
  try {
    let winner;
    let secondPlace;

    return await womClient.competitions
      .getCompetitionDetails(compId)
      .then((json: CompetitionDetails) => {
        const output = top5members(json);
        winner = output[0].player.displayName;
        secondPlace = output[1].player.displayName;
        return output;
      })
      .then((json) => jsonToOutput(json, type))
      .then((res) => {
        let message = `Here are the results for the ${
          type === 'sotw' ? 'Skill of the Week' : 'Boss of the Week'
        } competition:\n`;
        message += `\`\`\`${res.join('\n')}\`\`\``;
        message += `\nThank you to everyone who took part!\n${winner} gets 2 bonds for winning, ${secondPlace} gets 1 for coming in second place. Please contact any admin or leader for the payout.\n\nHappy scaping and we hope to see you all compete in the next event!`;
        msg.reply(message);
      });
  } catch (e) {
    incorrectId(e, msg);
  }
}

export async function getBalance(msg: Message, username: string) {
  try {
    const points = await getPointsByUsername(username);
    let message = '';
    if (points !== undefined) {
      message = `The current balance for ${username} is: ${points} Regencoin${parseInt(points) === 1 ? '' : 's'}`;
    } else {
      message = `No balance was found for ${username}. If you are sure you spelled the username correctly, please contact Belgiska. Alternatively, try the command again (sometimes it noodles out).`;
    }
    msg.reply(message);
  } catch (e) {
    allCatcher(e, msg);
    console.log(e);
  }
}

export async function getPetsOrLogTopTen(msg: Message, groupId: number, metric) {
  const usernames = await getAllDisplayNames(groupId);

  msg.reply(
    `Please wait while I fetch the top 10 for the metric "${metric}". (approx. ${(
      ((usernames?.length || 30) / 30 + 1) *
      5
    ).toFixed(0)} secs.)`
  );

  const resArray = await getColResMap(metric, usernames);

  if (metric === 'pets') {
    const arrayOfObjects = (await Promise.all(resArray)) as UserWithPets[];
    const sortedResArray = arrayOfObjects.sort((a: { pets: number }, b: { pets: number }) => b.pets - a.pets);

    await Promise.all(sortedResArray);

    msg.reply(buildMessage(sortedResArray, metric));
  } else {
    const arrayOfObjects = (await Promise.all(resArray)) as UserWithLogSlots[];
    const sortedResArray = arrayOfObjects.sort((a, b) => b.uniqueObtained - a.uniqueObtained);

    await Promise.all(sortedResArray);

    msg.reply(buildMessage(sortedResArray, metric));
  }
  console.log('\nBatch process finished.');
}
