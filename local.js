import { WOMClient } from "@wise-old-man/utils";
import { numberWithCommas, toCapitalCase } from "./scripts/utils/utils.js";

const womClient = new WOMClient();

const playerName = "Belgiska";
const metric = "slayer";
// let output = `Here are the stats for ${playerName}:\n`;

// const playerDetails = await womClient.players
//     .getPlayerDetails(playerName)
//     .then((json) => {
//         const array = Object.values(json.latestSnapshot.data.skills);
//         array.forEach((skill) => {
//             output += `${(skill.metric + ": ").padEnd(14)}${skill.level
//                 .toString()
//                 .padStart(4)} ${numberWithCommas(skill.experience).padStart(
//                 12
//             )} Exp   Rank ${skill.rank.toString().padStart(8)}   ${skill.ehp
//                 .toFixed(2)
//                 .padStart(8)} EHP\n`;
//         });
//     });

await womClient.players.getPlayerDetails(playerName).then((json) => {
    console.log(json.latestSnapshot.data.bosses);
});

// console.log(output);
