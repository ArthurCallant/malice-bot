import { BLACKLIST } from '../../constants/blacklist';
import { writeFile } from 'fs';
import { DateTime } from 'luxon';
import {
  BuildMessageUserArray,
  MessageBuilderOptions,
  Period,
  TopTenMetric,
  Type
} from '../../constants/application.types';
import { CompetitionDetails, MembershipWithPlayer, WOMClient } from '@wise-old-man/utils';

export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function top5members(json: CompetitionDetails) {
  return [...json['participations']]
    .sort((playerA, playerB) => parseInt(playerA['progress'].toString()) - parseInt(playerB['progress'].toString()))
    .slice(0, 5);
}

export function jsonToOutput(json: Object[], type: Type) {
  let suffix = type === 'sotw' ? 'exp' : 'kills';
  return json.map((p, i) => {
    return `RANK ${i + 1}: ${p['player']['displayName']} with ${numberWithCommas(p['progress']['gained'])} ${suffix}`;
  });
}

export function toCapitalCase(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function rollDice() {
  return Math.floor(Math.random() * 7);
}

export function sortMembershipsByMetric(memberships: MembershipWithPlayer[], metric: TopTenMetric) {
  switch (metric) {
    case 'ttm':
      return memberships.sort((a, b) => a.player.ttm - b.player.ttm).filter((a) => a.player.ttm !== 0);
    case 'exp':
    case 'ehb':
    case 'ehp':
      return memberships.sort((a, b) => b.player[metric] - a.player[metric]);
    default:
      throw new Error('Invalid metric provided.');
  }
}

export function formatDisplayNameForTopTen(position: number, username: string) {
  return `${((position + 1).toString() + '.').padEnd(3)} ${username.padEnd(12)}`;
}

export function buildMessage(
  sortedMemberships: BuildMessageUserArray,
  metric: TopTenMetric,
  options: MessageBuilderOptions = {}
) {
  let message = 'The following players are the members of Regeneration that ';
  switch (metric) {
    case 'ttm':
      message += `are closest to maxing:\n\`\`\`${sortedMemberships
        .map((m, i: number) => {
          return `${formatDisplayNameForTopTen(i, m.player.displayName)}: ${(
            m.player.ttm.toFixed(2) + ' hours left.'
          ).padStart(18)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'exp':
      message += `have the highest amount of Exp:\n\`\`\`${sortedMemberships
        .map((m, i: number) => {
          return `${formatDisplayNameForTopTen(i, m.player.displayName)}: ${(
            numberWithCommas(m.player.exp) + ' Exp.'
          ).padStart(18)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'ehb':
      message += `have the highest amount of Efficient Hours Bossed:\n\`\`\`${sortedMemberships
        .map((m, i: number) => {
          return `${formatDisplayNameForTopTen(i, m.player.displayName)}: ${(
            m.player.ehb.toFixed(2) + ' EHB.'
          ).padStart(15)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'ehp':
      message += `have the highest amount of Efficient Hours Played:\n\`\`\`${sortedMemberships
        .map((m, i: number) => {
          return `${formatDisplayNameForTopTen(i, m.player.displayName)}: ${(
            m.player.ehp.toFixed(2) + ' EHP.'
          ).padStart(15)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'log':
      message += `have the highest amount of unique Collection Log slots:\n\`\`\`${sortedMemberships
        .slice(0, 10)
        .map((user, index: number) => {
          return `${formatDisplayNameForTopTen(index, user.username)}: ${(
            user.uniqueObtained + '  collection log slots.'
          ).padStart(18)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'pets':
      message += `have the highest amount of unique pets:\n\`\`\`${sortedMemberships
        .slice(0, 10)
        .map((user, index: number) => {
          return `${formatDisplayNameForTopTen(index, user.username)}: ${(
            Math.trunc(user.pets).toFixed(2) + ' pets.'
          ).padStart(8)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'balance':
      message += `have the highest amount of Regencoins:\n\`\`\`${sortedMemberships
        .map((user, index: number) => {
          return `${formatDisplayNameForTopTen(index, user.username)}: ${(
            Math.trunc(user.points) + ' Regencoins.'
          ).padStart(10)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'month':
      message = `Here is the monthly leaderboard results for ${options.sdString} - ${options.edString}:\n
      Overall EXP:\n\`\`\`${
        options.expStats &&
        options.expStats
          .filter((user) => !BLACKLIST.includes(user.username))
          .slice(0, 10)
          .map((m, i) => {
            return `${formatDisplayNameForTopTen(i, m.username)}: ${(numberWithCommas(m.gained) + ' Exp.').padStart(
              18
            )}`;
          })
          .join('\n')
      }\`\`\`
      EHB:\n\`\`\`${
        options.ehbStats &&
        options.ehbStats
          .filter((user) => !BLACKLIST.includes(user.username))
          .slice(0, 10)
          .map((m, i) => {
            return `${formatDisplayNameForTopTen(i, m.username)}: ${(m.gained.toFixed(2) + ' EHB.').padStart(15)}`;
          })
          .join('\n')
      }\`\`\`
      EHP:\n\`\`\`${
        options.ehpStats &&
        options.ehpStats
          .filter((user) => !BLACKLIST.includes(user.username))
          .slice(0, 10)
          .map((m, i) => {
            return `${formatDisplayNameForTopTen(i, m.username)}: ${(m.gained.toFixed(2) + ' EHP.').padStart(15)}`;
          })
          .join('\n')
      }\`\`\`
      `;
    default:
      break;
  }
  return message;
}

export function logUsernames(usernames: string[]) {
  const output = usernames.join('\n');
  writeFile('src/public/logs/usernames_log.txt', output, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('A file has been created with errorred usernames');
  });
}

function getCurrentDateObject() {
  const date = DateTime.now();
  const month = date.month;
  const year = date.year;

  return {
    month,
    year
  };
}

export function getStartToEndPeriod({
  day = 1,
  month = getCurrentDateObject().month,
  year = getCurrentDateObject().year
}): Period {
  const startDate = DateTime.fromObject({ day: day, month: month, year: year });
  const endDate = startDate.endOf('month');

  return {
    startDate: startDate.toISO(),
    endDate: endDate.toISO()
  };
}

export async function fetchGroupGains(
  womClient: WOMClient,
  groupId: number,
  gainsPeriod: Period,
  metric: 'ehb' | 'ehp' | 'overall'
) {
  return await womClient.groups
    .getGroupGains(
      groupId,
      { startDate: gainsPeriod.startDate, endDate: gainsPeriod.endDate, metric: metric },
      { limit: 20 }
    )
    .then((result) =>
      result.map((p) => {
        return {
          username: p.player.displayName,
          gained: p.data.gained
        };
      })
    );
}
