import dotenv from 'dotenv';
dotenv.config();
import { WOMClient } from '@wise-old-man/utils';
import { getAllPointsSorted } from './scripts/points.js';
import { buildMessage, getPeriod } from './scripts/utils/utils.js';
import { BLACKLIST } from './constants/blacklist.js';

const Period = {
  FIVE_MIN: 'five_min',
  WEEK: 'week',
  DAY: 'day',
  MONTH: 'month',
  YEAR: 'year'
};

/**
 * This file is intended as a local work area, to test new features. Instead of needing to test in a discord environment, console.log your function results.
 * Don't use this file in production, don't create functions here that are to be imported elsewhere.
 * Consider this file as deprecated and always possible to be deleted.
 */

// Start your local development here
const womClient = new WOMClient();
const groupId = process.env.GROUP_ID;

const gainsPeriod = getPeriod({ day: 1, month: 4, year: 2023 });

const statistics = await womClient.groups.getGroupGains(
  groupId,
  { startDate: gainsPeriod.startDate, endDate: gainsPeriod.endDate, metric: 'overall' },
  { limit: 20 }
);

console.log(
  statistics.map((p) => {
    return {
      username: p.player.displayName,
      gained: p.gained
    };
  })
);
