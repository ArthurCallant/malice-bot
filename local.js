import { WOMClient } from "@wise-old-man/utils";
import { numberWithCommas, toCapitalCase } from "./scripts/utils/utils.js";

const womClient = new WOMClient();

const playerName = "Regen Matt";
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
    const array = Object.values(json.latestSnapshot.data.skills);
    const skillStats = array.filter((skill) => {
        return skill.metric === metric;
    })[0];
    let message = `Here are the ${toCapitalCase(
        skillStats.metric
    )} stats for Belgiska:\n\`\`\`Level ${skillStats.level}  ${numberWithCommas(
        skillStats.experience
    )} Exp  Rank ${numberWithCommas(skillStats.rank)}  ${skillStats.ehp.toFixed(
        2
    )} EHP\`\`\``;
    console.log(message);
});

// console.log(output);
