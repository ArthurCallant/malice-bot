import dotenv from 'dotenv';
dotenv.config();
import { buildMessage } from './utils/utils.js';
import { getAllDisplayNames, getColTopTen } from './wom.js';

/**
 * This file is used to obtain the top 10 for collection log slots for Regeneration.
 * It uses the Wise Old Man and Collection Log api's so proper integration should be setup for members wishing to compete.
 * Don't put this as a command as it has a pretty long runtime.
 */

const groupId = process.env.GROUP_ID;
const usernames = await getAllDisplayNames(groupId);
const logArray = await getColTopTen('log', usernames);
const arrayOfObjects = await Promise.all(logArray);
const sortedLogArray = arrayOfObjects.sort((a, b) => b.uniqueObtained - a.uniqueObtained);
const message = buildMessage(sortedLogArray, 'log');
console.log(message);
