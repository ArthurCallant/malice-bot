import { WOMClient } from "@wise-old-man/utils";
import { incorrectId } from "./errors/handling.js";
import { jsonToOutput, top5members } from "./utils/utils.js";

export async function getSotwResults(msg, id) {
    try {
        const womClient = new WOMClient();
        return await womClient.competitions
            .getCompetitionDetails(id)
            .then((json) => top5members(json))
            .then((json) => jsonToOutput(json))
            .then((res) => {
                let message = "";
                res.forEach((r) => {
                    message += `${r}\n`;
                });
                msg.reply(message);
            });
    } catch (e) {
        incorrectId(e, msg);
    }
}

export async function getBotwResults(msg, id) {
    try {
        const womClient = new WOMClient();
        return await womClient.competitions
            .getCompetitionDetails(id)
            .then((json) => top5members(json))
            .then((json) => jsonToOutput(json))
            .then((res) => {
                let message = "";
                res.forEach((r) => {
                    message += `${r}\n`;
                });
                msg.reply(message);
            });
    } catch (e) {
        incorrectId(e, msg);
    }
}
