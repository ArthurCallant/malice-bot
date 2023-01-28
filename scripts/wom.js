import { WOMClient } from "@wise-old-man/utils";
import { incorrectId, topTenTtmError } from "./errors/handling.js";
import { jsonToOutput, top5members } from "./utils/utils.js";

const womClient = new WOMClient();

export async function getResults(msg, id, type) {
    try {
        let winner;
        let secondPlace;
        return await womClient.competitions
            .getCompetitionDetails(id)
            .then((json) => {
                const output = top5members(json);
                winner = output[0].player.displayName;
                secondPlace = output[1].player.displayName;
                return output;
            })
            .then((json) => jsonToOutput(json, type))
            .then((res) => {
                let message = `Here are the results for the ${
                    type === "sotw" ? "Skill of the Week" : "Boss of the Week"
                } competition:\n`;
                message += `\`\`\`${res.join("\n")}\`\`\``;
                message += `\nThank you to everyone who took part!\n${winner} gets 2 bonds for winning, ${secondPlace} gets 1 for coming in second place. Please contact any admin or leader for the payout.\n\nHappy scaping and we hope to see you all compete in the next event!`;
                msg.reply(message);
            });
    } catch (e) {
        incorrectId(e, msg);
    }
}

export async function getGroupCompetitions(msg, groupId) {
    const competitions = await womClient.groups.getGroupCompetitions(groupId);
    console.log(competitions);
}

export async function getTopTenTtm(msg, groupId) {
    try {
        let message =
            "The following players are the members of Regeneration that are closest to maxing:\n";
        const memberships = (await womClient.groups.getGroupDetails(groupId))
            .memberships;
        const sortedMemberships = memberships
            .sort((a, b) => a.player.ttm - b.player.ttm)
            .filter((a) => a.player.ttm !== 0)
            .slice(0, 10);
        message += `\`\`\`${sortedMemberships
            .map((m, i) => {
                return `${i + 1}. ${
                    m.player.displayName
                }: ${m.player.ttm.toFixed(2)} hours left.`;
            })
            .join("\n")}\`\`\``;
        msg.reply(message);
    } catch (e) {
        topTenTtmError(e, msg);
    }
}
