import dotenv from "dotenv";
dotenv.config();
import { WOMClient } from "@wise-old-man/utils";
import axios from "axios";
import { numberWithCommas, toCapitalCase } from "./scripts/utils/utils.js";
import { DateTime } from "luxon";

/**
 * This file is intended as a local work area, to test new features. Instead of needing to test in a discord environment, console.log your function results.
 * Don't use this file in production, don't create functions here that are to be imported elsewhere.
 * Consider this file as deprecated and always possible to be deleted.
 */

// Start your local development here
const womClient = new WOMClient();

const now = new Date();
let message = "";
const competitions = await womClient.groups.getGroupCompetitions(
    process.env.GROUP_ID
);
const compCalendar = [];
competitions.forEach((comp) => {
    if ((comp.startsAt < now && comp.endsAt > now) || comp.startsAt > now) {
        compCalendar.push({
            title: comp.title,
            startDay: DateTime.fromISO(comp.startsAt.toISOString()).weekdayLong,
            endDay: DateTime.fromISO(comp.endsAt.toISOString()).weekdayLong,
            start: DateTime.fromISO(comp.startsAt.toISOString()).toFormat(
                "LLL dd"
            ),
            end: DateTime.fromISO(comp.endsAt.toISOString()).toFormat("LLL dd"),
            startTime: DateTime.fromISO(comp.startsAt.toISOString()).toFormat(
                "hh:mm ZZZZ"
            ),
            endTime: DateTime.fromISO(comp.endsAt.toISOString()).toFormat(
                "hh:mm ZZZZ"
            ),
        });
    }
});
console.log(compCalendar);
message += `${compCalendar
    .map((comp) => {
        return `**${toCapitalCase(comp.startDay)} ${comp.start} --- ${
            comp.startTime
        } until ${comp.endDay} ${comp.end} ${comp.endTime}**\n - ${comp.title}`;
    })
    .join("\n")}`;
console.log(message);
