export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function top5members(json) {
    return json["participations"]
        .sort(function (playerA, playerB) {
            return playerA["progress"] > playerB["progress"];
        })
        .filter((p, i) => {
            return i <= 4;
        });
}

export async function jsonToOutput(json) {
    return await json.map((p, i) => {
        const output = `RANK ${i + 1}: ${
            p["player"]["displayName"]
        } with ${numberWithCommas(p["progress"]["gained"])} exp`;
        return output;
    });
}
