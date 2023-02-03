import { WOMClient } from "@wise-old-man/utils";
import { Bosses, Skills } from "../constants/enums.js";
import {
    allCatcher,
    incorrectId,
    playerError,
    topTenError,
} from "./errors/handling.js";
import {
    buildMessage,
    jsonToOutput,
    sortMembershipsByMetric,
    top5members,
    numberWithCommas,
    toCapitalCase,
} from "./utils/utils.js";
import { AttachmentBuilder } from "discord.js";
import { COMMAND_MESSAGES } from "../constants/messages.js";

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
    try {
        const competitions = await womClient.groups.getGroupCompetitions(
            groupId
        );
        console.log(competitions);
    } catch (e) {
        allCatcher(e, msg);
    }
}

export async function getTopTen(msg, groupId, metric) {
    try {
        const memberships = (await womClient.groups.getGroupDetails(groupId))
            .memberships;
        const sortedMemberships = sortMembershipsByMetric(
            memberships,
            metric
        ).slice(0, 10);
        const message = buildMessage(sortedMemberships, metric);
        msg.reply(message);
    } catch (e) {
        topTenError(e, msg);
    }
}

export async function getPlayerStats(msg, playerName) {
    try {
        const displayName = (
            await womClient.players.getPlayerDetails(playerName)
        ).displayName;
        const playerDetails = await womClient.players
            .getPlayerDetails(playerName)
            .then((json) => {
                let output = `Here are the stats for ${displayName}:\n`;
                const array = Object.values(json.latestSnapshot.data.skills);
                output += "```";
                array.forEach((skill) => {
                    output += `${(toCapitalCase(skill.metric) + ": ").padEnd(
                        14
                    )}${skill.level.toString().padStart(4)} ${numberWithCommas(
                        skill.experience
                    ).padStart(12)} Exp   Rank ${numberWithCommas(
                        skill.rank
                    ).padStart(11)}   ${skill.ehp
                        .toFixed(2)
                        .padStart(8)} EHP\n`;
                });
                output += "```";
                msg.reply(output);
            });
    } catch (e) {
        playerError(e, msg);
    }
}

export async function getPlayerBossStats(msg, playerName) {
    try {
        const displayName = (
            await womClient.players.getPlayerDetails(playerName)
        ).displayName;
        let output = `Here are the boss stats for ${displayName}:\n\`\`\``;
        const playerDetails = await womClient.players
            .getPlayerDetails(playerName)
            .then((json) => {
                const array = Object.values(json.latestSnapshot.data.bosses);
                array.forEach((boss) => {
                    output += `${(Bosses[boss.metric] + ": ").padEnd(
                        23
                    )}${boss.kills
                        .toString()
                        .padStart(6)}  Rank ${numberWithCommas(
                        boss.rank
                    ).padStart(11)}   ${boss.ehb.toFixed(2).padStart(8)} EHB\n`;
                });
            });
        output += "```";
        msg.reply(output);
    } catch (e) {
        playerError(e, msg);
    }
}

export async function getPlayerSkillStat(msg, metric, playerName) {
    try {
        const displayName = (
            await womClient.players.getPlayerDetails(playerName)
        ).displayName;
        const playerStat = await womClient.players
            .getPlayerDetails(playerName)
            .then((json) => {
                const array = Object.values(json.latestSnapshot.data.skills);
                const skillStats = array.filter((skill) => {
                    return skill.metric === metric;
                })[0];
                let message = `Here are the ${
                    Skills[toCapitalCase(skillStats.metric)]
                } stats for ${displayName}:\n\`\`\`Level: ${
                    skillStats.level
                }\nExp: ${numberWithCommas(
                    skillStats.experience
                )} Exp\nRank: ${numberWithCommas(
                    skillStats.rank
                )}\nEHP: ${skillStats.ehp.toFixed(2)} hours\`\`\``;
                msg.reply(message);
            });
    } catch (e) {
        playerError(e, msg);
    }
}

export async function getPlayerBossStat(msg, metric, playerName) {
    try {
        const displayName = (
            await womClient.players.getPlayerDetails(playerName)
        ).displayName;
        const playerStat = await womClient.players
            .getPlayerDetails(playerName)
            .then((json) => {
                const array = Object.values(json.latestSnapshot.data.bosses);
                const bossStats = array.filter((boss) => {
                    return boss.metric === metric;
                })[0];
                let message = `Here are the ${
                    Bosses[bossStats.metric]
                } stats for ${displayName}:\n\`\`\`Kills or completions: ${numberWithCommas(
                    bossStats.kills
                )}\nRank: ${numberWithCommas(
                    bossStats.rank
                )}\nEHB: ${bossStats.ehb.toFixed(2)} hours\`\`\``;
                msg.reply(message);
            });
    } catch (e) {
        playerError(e, msg);
    }
}

export function getCommands(msg) {
    try {
        const message = `The Degeneration bot supports the following commands:\n\`\`\`${COMMAND_MESSAGES.join(
            ""
        )}\nThe boss_identifier is typically the name of the boss in lowercase, separated by underscores, e.g. thermonuclear_smoke_devil or chambers_of_xeric. We are working on allowing certain common abbreviations as well (e.g. cox or tob or thermy, etc...).\`\`\``;
        msg.reply(message);
    } catch (e) {
        allCatcher(e, msg);
    }
}

export function getClanRankCalculator(msg) {
    try {
        const attachment = new AttachmentBuilder(
            "public/files/Clan_Rank_Calculator_v2.0.xlsx"
        );
        msg.reply({
            content: "Here is the Clan Rank Calculator:",
            files: [attachment],
        });
    } catch (e) {
        allCatcher(e, msg);
    }
}
