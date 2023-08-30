import * as dotenv from 'dotenv';
dotenv.config();
import { WOMClient } from '@wise-old-man/utils';
import { BLACKLIST } from './constants/blacklist';

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

let fiya = 0;
let plein = 0;
let thrmy = 0;

for (let i = 0; i < 10000000; i++) {
  const number = Math.floor(Math.random() * BLACKLIST.length);

  switch (number) {
    case 0:
      fiya++;
      break;
    case 1:
      plein++;
      break;
    case 2:
      thrmy++;
      break;
  }
  // console.log(BLACKLIST[number]);
}

console.log('Holy Fiya: ', fiya);
console.log('P lein: ', plein);
console.log('Thrmy: ', thrmy);

const max = Math.max(fiya, plein, thrmy);

if (max === fiya) {
  console.log('You should ban Holy Fiya');
}
if (max === plein) {
  console.log('You should ban P lein');
}
if (max === thrmy) {
  console.log('You should ban Thrmy');
}
