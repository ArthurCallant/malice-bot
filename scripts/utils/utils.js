export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function top5members(json) {
    return [...json["participations"]]
        .sort((playerA, playerB) => playerA["progress"] > playerB["progress"])
        .slice(0, 5);
}

export function jsonToOutput(json, type) {
    let suffix = type === "sotw" ? "exp" : "kills";
    return json.map((p, i) => {
        return `RANK ${i + 1}: ${
            p["player"]["displayName"]
        } with ${numberWithCommas(p["progress"]["gained"])} ${suffix}`;
    });
}

export function toCapitalCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export function sortMembershipsByMetric(memberships, metric) {
    if (metric === "ttm") {
        return memberships
            .sort((a, b) => a.player.ttm - b.player.ttm)
            .filter((a) => a.player.ttm !== 0);
    } else if (metric === "exp") {
        return memberships.sort((a, b) => b.player.exp - a.player.exp);
    } else if (metric === "ehb") {
        return memberships.sort((a, b) => b.player.ehb - a.player.ehb);
    } else if (metric === "ehp") {
        return memberships.sort((a, b) => b.player.ehp - a.player.ehp);
    } else {
        throw new Error("Invalid metric provided.");
    }
}

export function buildMessage(sortedMemberships, metric) {
    let message = "The following players are the members of Regeneration that ";
    if (metric === "ttm") {
        message += "are closest to maxing:\n";
        message += `\`\`\`${sortedMemberships
            .map((m, i) => {
                return `${((i + 1).toString() + ".").padEnd(
                    3
                )} ${m.player.displayName.padEnd(12)}: ${(
                    m.player.ttm.toFixed(2) + " hours left."
                ).padStart(18)}`;
            })
            .join("\n")}\`\`\``;
    } else if (metric === "exp") {
        message += "have the highest amount of Exp:\n";
        message += `\`\`\`${sortedMemberships
            .map((m, i) => {
                return `${((i + 1).toString() + ".").padEnd(
                    3
                )} ${m.player.displayName.padEnd(12)}: ${(
                    numberWithCommas(m.player.exp) + " Exp."
                ).padStart(18)}`;
            })
            .join("\n")}\`\`\``;
    } else if (metric === "ehb") {
        message += "have the highest amount of Efficient Hours Bossed:\n";
        message += `\`\`\`${sortedMemberships
            .map((m, i) => {
                return `${((i + 1).toString() + ".").padEnd(
                    3
                )} ${m.player.displayName.padEnd(12)}: ${(
                    m.player.ehb.toFixed(2) + " EHB."
                ).padStart(15)}`;
            })
            .join("\n")}\`\`\``;
    } else if (metric === "ehp") {
        message += "have the highest amount of Efficient Hours Played:\n";
        message += `\`\`\`${sortedMemberships
            .map((m, i) => {
                return `${((i + 1).toString() + ".").padEnd(
                    3
                )} ${m.player.displayName.padEnd(12)}: ${(
                    m.player.ehp.toFixed(2) + " EHP."
                ).padStart(15)}`;
            })
            .join("\n")}\`\`\``;
    } else if (metric === "log") {
        message += "have the highest amount of unique Collection Log slots:\n";
        message += `\`\`\`${sortedMemberships
            .slice(0, 10)
            .map((user, index) => {
                return `${((index + 1).toString() + ".").padEnd(
                    3
                )} ${user.username.padEnd(12)}: ${(
                    user.uniqueObtained + " collection log slots."
                ).padStart(18)}`;
            })
            .join("\n")}\`\`\``;
    } else if (metric === "pets") {
        message += "have the highest amount of unique pets:\n";
        message += `\`\`\`${sortedMemberships
            .slice(0, 10)
            .map((user, index) => {
                return `${((index + 1).toString() + ".").padEnd(
                    3
                )} ${user.username.padEnd(12)}: ${(
                    user.pets + " pets."
                ).padStart(8)}`;
            })
            .join("\n")}\`\`\``;
    }
    return message;
}
