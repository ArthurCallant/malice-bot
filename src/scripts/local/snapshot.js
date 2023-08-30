import dotenv from 'dotenv';
dotenv.config();
import { WOMClient } from '@wise-old-man/utils';
import { DateTime } from 'luxon';
import { getColResMap } from '../wom';
import { writeFile } from 'fs';

/**
 * @deprecated
 * This file is deprecated, as the Collection Log plugin/api is too unreliable to use in competitions
 */

const metric = 'boss';
const boss = 'Zulrah';

const womClient = new WOMClient();
const groupId = process.env.GROUP_ID;

const memberships = (await womClient.groups.getGroupDetails(groupId)).memberships;
const displayNames = memberships.map((p) => {
  return p.player.displayName;
});

console.log(displayNames);

const resArray = await getColResMap(metric, displayNames, boss);
const arrayOfObjects = await Promise.all(resArray);
const sortedResArray = arrayOfObjects;

await Promise.all(sortedResArray);
console.log('\nBatch process finished.');

try {
  const csv = `username,killcount,${sortedResArray
    .find((user) => !!user)
    .data.map((data) => data.name)
    .join(',')}\n${sortedResArray
    .map((user) => {
      if (!user) {
        return;
      }
      return `${user.username},${user.kc},${user.data.map((data) => data.quantity).join(',')}\n`;
    })
    .join('')}`;

  const fileName = `${boss}_${DateTime.now()}.txt`;

  writeFile(`src/public/output/${fileName}`, csv, { flag: 'wx' }, function (err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log('Snapshot created.');
  });
} catch (e) {
  console.log(e);
}
