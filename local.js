import dotenv from "dotenv";
dotenv.config();
import { WOMClient } from "@wise-old-man/utils";
import axios from "axios";
import { numberWithCommas, toCapitalCase } from "./scripts/utils/utils.js";
import { DateTime } from "luxon";
import { getColResMap } from "./scripts/wom.js";

/**
 * This file is intended as a local work area, to test new features. Instead of needing to test in a discord environment, console.log your function results.
 * Don't use this file in production, don't create functions here that are to be imported elsewhere.
 * Consider this file as deprecated and always possible to be deleted.
 */

// Start your local development here
const womClient = new WOMClient();
const groupId = process.env.GROUP_ID;

const memberships = (await womClient.groups.getGroupDetails(groupId))
    .memberships;
const displayNames = memberships.map((p) => {
    return p.player.displayName;
});

// const colResArray = await getColResMap(
//     "boss",
//     displayNames,
//     "Thermonuclear Smoke Devil"
// );
// const arrayOfObjects = await Promise.all(colResArray);
// arrayOfObjects.forEach((user) => {
//     console.log(user);
//     if (!!user.username && !!user.data) {
//         console.log(user.username + ": \n", user["data"]);
//     }
// });
// arrayOfObjects[0].data.map((i) => {
//     console.log(i);
// });

// const displayNames = ["Rihsky", "Belgiska"];

console.log(displayNames);

const metric = "boss";

const resArray = await getColResMap(metric, displayNames, "Zulrah");
const arrayOfObjects = await Promise.all(resArray);
const sortedResArray = arrayOfObjects;
// metric === "pets"
//     ? arrayOfObjects.sort((a, b) => b.pets - a.pets)
//     : arrayOfObjects.sort((a, b) => b.uniqueObtained - a.uniqueObtained);
await Promise.all(sortedResArray);
console.log("\nBatch process finished.");
try {
    const message = sortedResArray
        .map((user) => {
            return `${user.username}: \n${user.data
                .map((data) => {
                    return `${data.name}: ${data.quantity}`.padStart(30);
                })
                .join("\n")}`;
        })
        .join("\n\n");
    console.log(message);
} catch (e) {
    console.log(e);
}
