import dotenv from "dotenv";
dotenv.config();
import { WOMClient } from "@wise-old-man/utils";
import axios from "axios";
import { numberWithCommas, toCapitalCase } from "./scripts/utils/utils.js";

/**
 * This file is intended as a local work area, to test new features. Instead of needing to test in a discord environment, console.log your function results.
 * Don't use this file in production, don't create functions here that are to be imported elsewhere.
 * Consider this file as deprecated and always possible to be deleted.
 */

// Start your local development here
const womClient = new WOMClient();

const now = new Date();
const ongoingComps = [];
const futureComps = [];
const competitions = await womClient.groups.getGroupCompetitions(
    process.env.GROUP_ID
);
competitions.forEach((comp) => {
    // console.log("startsAt ", comp.startsAt);
    // console.log("endsAt ", comp.endsAt);
    if (comp.startsAt < now && comp.endsAt > now) {
        ongoingComps.push(comp.title);
    } else if (comp.startsAt > now) {
        futureComps.push(comp.title);
    }
});
ongoingComps.length > 0
    ? console.log(
          "The ongoing competitions are: ",
          ongoingComps
              .map((c) => {
                  return `${c}\n`;
              })
              .join("")
      )
    : console.log("There are currently no ongoing competitions");

futureComps.length > 0
    ? console.log(
          "The future competitions are: ",
          futureComps
              .map((c) => {
                  return `${c}\n`;
              })
              .join("")
      )
    : console.log("There are currently no future competitions");
