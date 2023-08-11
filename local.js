import dotenv from 'dotenv';
dotenv.config();
import { WOMClient } from '@wise-old-man/utils';
import { getAllPointsSorted } from './scripts/points.js';
import { buildMessage } from './scripts/utils/utils.js';
import { BLACKLIST } from './constants/blacklist.js';

/**
 * This file is intended as a local work area, to test new features. Instead of needing to test in a discord environment, console.log your function results.
 * Don't use this file in production, don't create functions here that are to be imported elsewhere.
 * Consider this file as deprecated and always possible to be deleted.
 */

// Start your local development here
const womClient = new WOMClient();
const groupId = process.env.GROUP_ID;

const sortedPointsArray = (await getAllPointsSorted())
  .filter((user) => !BLACKLIST.includes(user.username))
  .slice(0, 10);
console.log(buildMessage(sortedPointsArray, 'balance'));
