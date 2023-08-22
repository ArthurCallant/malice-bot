import dotenv from 'dotenv';
dotenv.config();
import { WOMClient } from '@wise-old-man/utils';
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

const month = 5;
const year = 2023;

getMonthlyGains(null, groupId, { month: month, year: year });
