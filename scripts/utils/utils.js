import { writeFile } from 'fs';
import { DateTime } from 'luxon';

export function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export function top5members(json) {
  return [...json['participations']].sort((playerA, playerB) => playerA['progress'] > playerB['progress']).slice(0, 5);
}

export function jsonToOutput(json, type) {
  let suffix = type === 'sotw' ? 'exp' : 'kills';
  return json.map((p, i) => {
    return `RANK ${i + 1}: ${p['player']['displayName']} with ${numberWithCommas(p['progress']['gained'])} ${suffix}`;
  });
}

export function toCapitalCase(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sortMembershipsByMetric(memberships, metric) {
  if (metric === 'ttm') {
    return memberships.sort((a, b) => a.player.ttm - b.player.ttm).filter((a) => a.player.ttm !== 0);
  } else if (metric === 'exp') {
    return memberships.sort((a, b) => b.player.exp - a.player.exp);
  } else if (metric === 'ehb') {
    return memberships.sort((a, b) => b.player.ehb - a.player.ehb);
  } else if (metric === 'ehp') {
    return memberships.sort((a, b) => b.player.ehp - a.player.ehp);
  } else {
    throw new Error('Invalid metric provided.');
  }
}

export function formatDisplayNameForTopTen(position, username) {
  return `${((position + 1).toString() + '.').padEnd(3)} ${username.padEnd(12)}`;
}

export function buildMessage(sortedMemberships, metric) {
  let message = 'The following players are the members of Regeneration that ';
  switch (metric) {
    case 'ttm':
      message += 'are closest to maxing:\n';
      message += `\`\`\`${sortedMemberships
        .map((m, i) => {
          return `${formatDisplayNameForTopTen(i, m.player.displayName)}: ${(
            m.player.ttm.toFixed(2) + ' hours left.'
          ).padStart(18)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'exp':
      message += 'have the highest amount of Exp:\n';
      message += `\`\`\`${sortedMemberships
        .map((m, i) => {
          return `${formatDisplayNameForTopTen(i, m.player.displayName)}: ${(
            numberWithCommas(m.player.exp) + ' Exp.'
          ).padStart(18)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'ehb':
      message += 'have the highest amount of Efficient Hours Bossed:\n';
      message += `\`\`\`${sortedMemberships
        .map((m, i) => {
          return `${formatDisplayNameForTopTen(i, m.player.displayName)}: ${(
            m.player.ehb.toFixed(2) + ' EHB.'
          ).padStart(15)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'ehp':
      message += 'have the highest amount of Efficient Hours Played:\n';
      message += `\`\`\`${sortedMemberships
        .map((m, i) => {
          return `${formatDisplayNameForTopTen(i, m.player.displayName)}: ${(
            m.player.ehp.toFixed(2) + ' EHP.'
          ).padStart(15)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'log':
      message += 'have the highest amount of unique Collection Log slots:\n';
      message += `\`\`\`${sortedMemberships
        .slice(0, 10)
        .map((user, index) => {
          return `${formatDisplayNameForTopTen(index, user.username)}: ${(
            user.uniqueObtained + '  collection log slots.'
          ).padStart(18)}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'pets':
      message += 'have the highest amount of unique pets:\n';
      message += `\`\`\`${sortedMemberships
        .slice(0, 10)
        .map((user, index) => {
          return `${formatDisplayNameForTopTen(index, user.username)}: ${(user.pets.toFixed(2) + ' pets.').padStart(
            8
          )}`;
        })
        .join('\n')}\`\`\``;
      break;
    case 'balance':
      message += 'have the highest amount of Regencoins:\n';
      message += `\`\`\`${sortedMemberships
        .map((user, index) => {
          return `${formatDisplayNameForTopTen(index, user.username)}: ${(user.points + ' Regencoins.').padStart(10)}`;
        })
        .join('\n')}\`\`\``;
      break;
    default:
      break;
  }
  return message;
}

export function logUsernames(usernames) {
  const output = usernames.join('\n');
  writeFile('public/logs/usernames_log.txt', output, (err) => {
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
}) {
  const startDate = DateTime.fromObject({ day: day, month: month, year: year });
  const endDate = startDate.endOf('month');

  return {
    startDate: startDate.toISO(),
    endDate: endDate.toISO()
  };
}
