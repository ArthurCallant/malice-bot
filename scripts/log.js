import dotenv from "dotenv";
dotenv.config();
import { WOMClient } from "@wise-old-man/utils";
import axios from "axios";

/**
 * This file is used to obtain the top 10 for collection log slots for Regeneration.
 * It uses the Wise Old Man and Collection Log api's so proper integration should be setup for members wishing to compete.
 * Don't put this as a command as it has a pretty long runtime.
 */

const groupId = process.env.GROUP_ID;

const womClient = new WOMClient();

const waitForMs = (ms) =>
    new Promise((resolve, reject) => setTimeout(() => resolve(), ms));

const memberships = (await womClient.groups.getGroupDetails(groupId))
    .memberships;

const usernames = memberships.map((p) => {
    return p.player.displayName;
});

const colLogArray = await getCollectionLogUserArray();

const sortedColLogArray = colLogArray.sort(
    (a, b) => b.uniqueObtained - a.uniqueObtained
);

let message =
    "The following players are the members of Regeneration that have the highest amount of unique collection log slots:\n";
message += `\`\`\`${sortedColLogArray
    .slice(0, 10)
    .map((user, index) => {
        return `${((index + 1).toString() + ".").padEnd(
            3
        )} ${user.username.padEnd(12)}: ${(
            user.uniqueObtained + " collection log slots."
        ).padStart(18)}`;
    })
    .join("\n")}\`\`\``;

console.log(message);

async function getCollectionLogUserArray() {
    const batchSize = 50; // tweak this number if api fails (set it lower and wait a couple of mins before trying again)
    let curReq = 0;

    const promises = [];
    const userColLogMap = [];
    while (curReq < usernames.length) {
        const end =
            usernames.length < curReq + batchSize
                ? usernames.length
                : curReq + batchSize;
        const concurrentReq = new Array(batchSize);

        for (let index = curReq; index < end; index++) {
            const promise = axios
                .get(
                    `https://api.collectionlog.net/collectionlog/user/${usernames[index]}`
                )
                .then((res) => {
                    userColLogMap.push({
                        username: usernames[index],
                        accountType: res.data.collectionLog.accountType,
                        totalObtained: res.data.collectionLog.totalObtained,
                        totalItems: res.data.collectionLog.totalItems,
                        uniqueObtained: res.data.collectionLog.uniqueObtained,
                    });
                })
                .catch((error) => console.log(error.response.data));
            concurrentReq.push(promise);
            promises.push(promise);
            console.log(`sending request ${curReq}...`);
            curReq++;
        }
        console.log(`requests ${curReq - batchSize}-${curReq} done.`);
        await Promise.all([waitForMs(5000), Promise.all(concurrentReq)]);
    }
    await Promise.all([promises]);
    return userColLogMap;
}
