import axios from 'axios';
import { GROUP_ID } from '../../constants/env.constants';
import { getAllDisplayNames } from '../wom';
import { formatDisplayNameForTopTen } from '../utils/utils';

function chunkArray(array: any[], size: number) {
  const chunkedArray = [];
  let index = 0;
  while (index < array.length) {
    chunkedArray.push(array.slice(index, size + index));
    index += size;
  }
  return chunkedArray;
}

const waitForMs = (ms: number) => new Promise<void>((resolve) => setTimeout(() => resolve(), ms));

async function getMembersColLogs() {
  const usernames = await getAllDisplayNames(GROUP_ID);
  const usernameChunks = chunkArray(usernames, 20);

  const logResults = [];

  console.log('Fetching collection log data...');
  for (let i = 0; i < usernameChunks.length; i++) {
    console.log(`Fetching chunk... (${i + 1})`);
    const chunk = usernameChunks[i];
    const promises = chunk.map(async (username: string) => {
      return await axios
        .get(`https://api.collectionlog.net/collectionlog/user/${username}`)
        .then((res) => {
          logResults.push({
            username,
            pets: res.data.collectionLog.tabs['Other']['All Pets'].items.filter((i) => i.obtained).length
          });
        })
        .catch((e) => {
          console.log(username, ': ', e.response.data.error);
        })
        .catch((e) => {
          console.log(username, ': ', e);
        });
    });

    await Promise.all([promises, waitForMs(5000)]);
  }

  await Promise.all([waitForMs(5000)]);
  console.log('Finished fetching collection log data!');
  console.log('```');
  console.log(
    logResults
      .sort((a, b) => b.pets - a.pets)
      .slice(0, 25)
      .map((r, i) => `${formatDisplayNameForTopTen(i, r.username)}: ${(r.pets + ' pets.').padStart(9)}`)
      .join('\n')
  );
  console.log('```');
}

getMembersColLogs();
