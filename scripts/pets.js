import dotenv from "dotenv";
dotenv.config();
import { buildMessage } from "./utils/utils.js";
import { getAllDisplayNames, getColTopTen } from "./wom.js";

/**
 * This file is used to obtain the top 10 pets for Regeneration.
 * It uses the Wise Old Man and Collection Log api's so proper integration should be setup for members wishing to compete.
 * Don't put this as a command as it has a pretty long runtime.
 */

const groupId = process.env.GROUP_ID;
const usernames = await getAllDisplayNames(groupId);
const petsArray = await getColTopTen("pets", usernames);
const arrayOfObjects = await Promise.all(petsArray);
const sortedPetsArray = arrayOfObjects.sort((a, b) => b.pets - a.pets);
const message = buildMessage(sortedPetsArray, "pets");
console.log(message);
