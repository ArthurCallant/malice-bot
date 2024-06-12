import { WOMClient } from '@wise-old-man/utils';
import { TopTenMetric } from '../../constants/application.types';
import { BLACKLIST } from '../../constants/blacklist';
import { getAllPointsSorted } from '../points';
import { getTopTen } from '../wom';
import { buildMessage, sortMembershipsByMetric } from '../utils/utils';
import { GROUP_ID } from '../../constants/env.constants';

const womClient = new WOMClient();

const METRICS: TopTenMetric[] = ['ehb', 'ehp', 'exp', 'ttm'];

async function getMetricResults(metric: TopTenMetric) {
  switch (metric) {
    case 'balance':
      const sortedPointsArray = (await getAllPointsSorted())
        .filter((user) => !BLACKLIST.includes(user.username))
        .slice(0, 25);
      return buildMessage(sortedPointsArray, metric);
    default:
      const memberships = (await womClient.groups.getGroupDetails(GROUP_ID)).memberships;
      const sortedMemberships = sortMembershipsByMetric(memberships, metric)
        .filter((user) => !BLACKLIST.includes(user.player.displayName))
        .slice(0, 25);
      return buildMessage(sortedMemberships, metric);
  }
}

async function getLeaderboards() {
  console.log('Fetching leaderboards...');

  for (const metric of METRICS) {
    console.log(`Fetching ${metric} leaderboard...`);
    console.log(await getMetricResults(metric));
    console.log('\n\n\n\n');
  }
}

getLeaderboards();
