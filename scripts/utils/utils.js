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
                return `${i + 1}. ${
                    m.player.displayName
                }: ${m.player.ttm.toFixed(2)} hours left.`;
            })
            .join("\n")}\`\`\``;
    } else if (metric === "exp") {
        message += "have the highest amount of Exp:\n";
        message += `\`\`\`${sortedMemberships
            .map((m, i) => {
                return `${i + 1}. ${m.player.displayName}: ${numberWithCommas(
                    m.player.exp
                )} Exp.`;
            })
            .join("\n")}\`\`\``;
    } else if (metric === "ehb") {
        message += "have the highest amount of Efficient Hours Bossed:\n";
        message += `\`\`\`${sortedMemberships
            .map((m, i) => {
                return `${i + 1}. ${
                    m.player.displayName
                }: ${m.player.ehb.toFixed(2)} EHB.`;
            })
            .join("\n")}\`\`\``;
    } else if (metric === "ehp") {
        message += "have the highest amount of Efficient Hours Played:\n";
        message += `\`\`\`${sortedMemberships
            .map((m, i) => {
                return `${i + 1}. ${
                    m.player.displayName
                }: ${m.player.ehp.toFixed(2)} EHP.`;
            })
            .join("\n")}\`\`\``;
    }
    return message;
}
