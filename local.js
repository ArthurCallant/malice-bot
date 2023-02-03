import { WOMClient } from "@wise-old-man/utils";
import { numberWithCommas, toCapitalCase } from "./scripts/utils/utils.js";

/**
 * This file is intended as a local work area, to test new features. Instead of needing to test in a discord environment, console.log your function results.
 * Don't use this file in production, don't create functions here that are to be imported elsewhere.
 * Consider this file as deprecated and always possible to be deleted.
 */

const womClient = new WOMClient();

const playerName = "Belgiska";
const metric = "slayer";

await womClient.players.getPlayerDetails(playerName).then((json) => {
    console.log(json.latestSnapshot.data.bosses);
});
