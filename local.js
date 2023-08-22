import dotenv from 'dotenv';
dotenv.config();
import { WOMClient } from '@wise-old-man/utils';
import { getAllPointsSorted } from './scripts/points.js';
import { buildMessage, getPeriodObjectFromValues, getPeriod } from './scripts/utils/utils.js';
import { BLACKLIST } from './constants/blacklist.js';
import { getMonthlyGains } from './scripts/wom.js';

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

// const dateObject = getPeriodObjectFromValues({});
// console.log(dateObject);
// const startDate = { day: dateObject.startDay, month: dateObject.month, year: dateObject.year };
// const endDate = { day: dateObject.endDay, month: dateObject.month, year: dateObject.year };

const startDay = 1;
const endDay = 31;
const month = 5;
const year = 2023;

getMonthlyGains(null, groupId, { startDay: startDay, endDay: endDay, month: month, year: year });
// getMonthlyGains(null, groupId);
// console.log(startDate);
// console.log(endDate);

// const gainsPeriod = getPeriod(startDate, endDate);

// const overall = await womClient.groups.getGroupGains(
//   groupId,
//   { startDate: gainsPeriod.startDate, endDate: gainsPeriod.endDate, metric: 'overall' },
//   { limit: 20 }
// );

// const ehb = await womClient.groups.getGroupGains(
//   groupId,
//   { startDate: gainsPeriod.startDate, endDate: gainsPeriod.endDate, metric: 'ehb' },
//   { limit: 20 }
// );

// const ehp = await womClient.groups.getGroupGains(
//   groupId,
//   { startDate: gainsPeriod.startDate, endDate: gainsPeriod.endDate, metric: 'ehp' },
//   { limit: 20 }
// );

// console.log(statistics);

// console.log(
//   overall.map((p) => {
//     return {
//       username: p.player.displayName,
//       gained: p.data.gained
//     };
//   })
// );

// console.log(
//   ehb.map((p) => {
//     return {
//       username: p.player.displayName,
//       gained: p.data.gained
//     };
//   })
// );

// console.log(
//   ehp.map((p) => {
//     return {
//       username: p.player.displayName,
//       gained: p.data.gained
//     };
//   })
// );
