import { WOMClient } from '@wise-old-man/utils';
import axios from 'axios';
import { Bosses, Skills } from '../constants/enums.js';
import { allCatcher, incorrectId, playerError, topTenError } from './errors/handling.js';
import {
  buildMessage,
  jsonToOutput,
  sortMembershipsByMetric,
  top5members,
  numberWithCommas,
  toCapitalCase,
  logUsernames
} from './utils/utils.js';
import { getPointsByUsername } from '../scripts/points.js';
import { AttachmentBuilder } from 'discord.js';
import { COMMAND_MESSAGES } from '../constants/messages.js';
import { DateTime } from 'luxon';
import { BLACKLIST } from '../constants/blacklist.js';
import { writeFile } from 'fs';

const womClient = new WOMClient();

export async function getAllDisplayNames(groupId) {
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

export async function getTopTen(msg, groupId, metric) {
  try {
    if (metric === 'pets' || metric === 'log') {
      const usernames = await getAllDisplayNames(groupId);
      msg.reply(
        `Please wait while I fetch the top 10 for the metric "${metric}". (approx. ${(
          (usernames.length / 30 + 1) *
          5
        ).toFixed(0)} secs.)`
      );
      const resArray = await getColResMap(metric, usernames);
      const arrayOfObjects = await Promise.all(resArray);
      const sortedResArray =
        metric === 'pets'
          ? arrayOfObjects.sort((a, b) => b.pets - a.pets)
          : arrayOfObjects.sort((a, b) => b.uniqueObtained - a.uniqueObtained);
      await Promise.all(sortedResArray);
      msg.reply(buildMessage(sortedResArray, metric));
      console.log('\nBatch process finished.');
    } else {
      const memberships = (await womClient.groups.getGroupDetails(groupId)).memberships;
      const sortedMemberships = sortMembershipsByMetric(memberships, metric)
        .filter((user) => !BLACKLIST.includes(user.player.displayName))
        .slice(0, 10);
      msg.reply(buildMessage(sortedMemberships, metric));
    }
  } catch (e) {
    topTenError(e, msg);
  }
}

export async function getGroupCompetitions(msg, groupId) {
  try {
    const now = new Date();
    const ongoingComps = [];
    const futureComps = [];
    let message = '';
    const competitions = await womClient.groups.getGroupCompetitions(groupId);
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

export async function getCompCalendar(msg, groupId) {
  try {
    const now = new Date();
    let message = '';
    const competitions = await womClient.groups.getGroupCompetitions(groupId);
    const compCalendar = [];
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
    message += `${compCalendar
      .sort((a, b) => a.startDt - b.startDt)
      .map((comp) => {
        return `**${toCapitalCase(comp.startDay)} ${comp.start} --- ${comp.startTime}    until    ${toCapitalCase(
          comp.endDay
        )} ${comp.end} --- ${comp.endTime}**\n - ${comp.title}`;
      })
      .join('\n')}`;
    msg.reply(message);
  } catch (e) {
    allCatcher(e, msg);
  }
}

export async function getPlayerStats(msg, playerName) {
  try {
    const displayName = (await womClient.players.getPlayerDetails(playerName)).displayName;
    const playerDetails = await womClient.players.getPlayerDetails(playerName).then((json) => {
      let output = `Here are the stats for ${displayName}:\n`;
      const array = Object.values(json.latestSnapshot.data.skills);
      output += '```';
      array.forEach((skill) => {
        output += `${(toCapitalCase(skill.metric) + ': ').padEnd(14)}${skill.level
          .toString()
          .padStart(4)} ${numberWithCommas(skill.experience).padStart(12)} Exp   Rank ${numberWithCommas(
          skill.rank
        ).padStart(11)}   ${skill.ehp.toFixed(2).padStart(8)} EHP\n`;
      });
      output += '```';
      msg.reply(output);
    });
  } catch (e) {
    playerError(e, msg);
  }
}

export async function getPlayerBossStats(msg, playerName) {
  try {
    const displayName = (await womClient.players.getPlayerDetails(playerName)).displayName;
    let output = `Here are the boss stats for ${displayName}:\n\`\`\``;
    const playerDetails = await womClient.players.getPlayerDetails(playerName).then((json) => {
      const array = Object.values(json.latestSnapshot.data.bosses);
      array.forEach((boss) => {
        output += `${(Bosses[boss.metric] + ': ').padEnd(23)}${boss.kills
          .toString()
          .padStart(6)}  Rank ${numberWithCommas(boss.rank).padStart(11)}   ${boss.ehb.toFixed(2).padStart(8)} EHB\n`;
      });
    });
    output += '```';
    msg.reply(output);
  } catch (e) {
    playerError(e, msg);
  }
}

export async function getPlayerSkillStat(msg, metric, playerName) {
  try {
    const displayName = (await womClient.players.getPlayerDetails(playerName)).displayName;
    const playerStat = await womClient.players.getPlayerDetails(playerName).then((json) => {
      const array = Object.values(json.latestSnapshot.data.skills);
      const skillStats = array.filter((skill) => {
        return skill.metric === metric;
      })[0];
      let message = `Here are the ${Skills[toCapitalCase(skillStats.metric)]} stats for ${displayName}:\n\`\`\`Level: ${
        skillStats.level
      }\nExp: ${numberWithCommas(skillStats.experience)} Exp\nRank: ${numberWithCommas(
        skillStats.rank
      )}\nEHP: ${skillStats.ehp.toFixed(2)} hours\`\`\``;
      msg.reply(message);
    });
  } catch (e) {
    playerError(e, msg);
  }
}

export async function getPlayerBossStat(msg, metric, playerName) {
  try {
    const displayName = (await womClient.players.getPlayerDetails(playerName)).displayName;
    const playerStat = await womClient.players.getPlayerDetails(playerName).then((json) => {
      const array = Object.values(json.latestSnapshot.data.bosses);
      const bossStats = array.filter((boss) => {
        return boss.metric === metric;
      })[0];
      let message = `Here are the ${
        Bosses[bossStats.metric]
      } stats for ${displayName}:\n\`\`\`Kills or completions: ${numberWithCommas(
        bossStats.kills
      )}\nRank: ${numberWithCommas(bossStats.rank)}\nEHB: ${bossStats.ehb.toFixed(2)} hours\`\`\``;
      msg.reply(message);
    });
  } catch (e) {
    playerError(e, msg);
  }
}

export function getCommands(msg) {
  try {
    const message = `The Degeneration bot supports the following commands:\n\`\`\`${COMMAND_MESSAGES.join(
      ''
    )}\nThe boss_identifier is typically the name of the boss in lowercase, separated by underscores, e.g. thermonuclear_smoke_devil or chambers_of_xeric. We are working on allowing certain common abbreviations as well (e.g. cox or tob or thermy, etc...).\`\`\``;
    msg.reply(message);
  } catch (e) {
    allCatcher(e, msg);
  }
}

export function getClanRankCalculator(msg) {
  try {
    const attachment = new AttachmentBuilder('public/files/Clan_Rank_Calculator_v3.2.xlsx');
    msg.reply({
      content: 'Here is the Clan Rank Calculator:',
      files: [attachment]
    });
  } catch (e) {
    allCatcher(e, msg);
  }
}

export async function getColResMap(metric, usernames, bossName = '') {
  const batchSize = 70; // tweak this number if api fails (set it lower and wait a couple of mins before trying again)
  let curReq = 0;

  // Collect failed fetch usernames
  const failedUsers = [];

  const promises = [];
  const resMap = [];
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

const waitForMs = (ms) => new Promise((resolve, reject) => setTimeout(() => resolve(), ms));

async function colLogObjectBuilder(metric, usernames, index, res, bossName) {
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
    if (metric === 'boss') {
      return {
        username: usernames[index],
        data: res.data.collectionLog.tabs.Bosses[bossName].items,
        kc: res.data.collectionLog.tabs.Bosses[bossName].killCount[0].amount
      };
    }
  } catch (e) {
    console.log(`${usernames[index]} is missing data, skipping...`);
  }
}

export async function getResults(msg, id, type) {
  try {
    let winner;
    let secondPlace;
    return await womClient.competitions
      .getCompetitionDetails(id)
      .then((json) => {
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

export async function getBossSnapshotCsv(msg, groupId, boss) {
  try {
    const displayNames = await getAllDisplayNames(groupId);
    await msg.reply(
      `Please wait while I create a snapshot for "${boss}". (approx. ${((displayNames.length / 30 + 1) * 5).toFixed(
        0
      )} secs.)`
    );
    const resArray = await getColResMap('boss', displayNames, boss);
    const arrayOfObjects = await Promise.all(resArray);
    const sortedResArray = arrayOfObjects;
    await Promise.all(sortedResArray);
    console.log('\nBatch process finished.');

    const csv = `username,killcount,${sortedResArray
      .find((user) => !!user)
      .data.map((data) => data.name)
      .join(',')}\n${sortedResArray
      .map((user) => {
        if (!user) {
          return;
        }
        return `${user.username},${user.kc},${user.data.map((data) => data.quantity).join(',')}\n`;
      })
      .join('')}`;

    const fileName = `${boss}_${DateTime.now()}.tsx`;

    writeFile(`public/output/${fileName}`, csv, { flag: 'wx' }, function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Snapshot created.');
    });

    const attachment = new AttachmentBuilder(`public/output/${fileName}`);
    await msg.reply({
      content: 'Here is a csv of the created snapshot:',
      files: [attachment]
    });
  } catch (e) {
    allCatcher(e, msg);
    console.log(e);
  }
}

export async function getBalance(msg, username) {
  try {
    const points = await getPointsByUsername(username);
    let message = '';
    if (points !== undefined) {
      message = `The current balance for ${username} is: ${points} Regencoin${points === 1 ? '' : 's'}`;
    } else {
      message = `No balance was found for ${username}. If you are sure you spelled the username correctly, please contact Belgiska. Alternatively, try the command again (sometimes it noodles out).`;
    }
    msg.reply(message);
  } catch (e) {
    allCatcher(e, msg);
    console.log(e);
  }
}
