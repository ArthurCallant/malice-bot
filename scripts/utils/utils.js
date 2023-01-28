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
