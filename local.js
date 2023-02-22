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
axios
    .get("https://api.collectionlog.net/collectionlog/user/well owl be")
    .then((res) => {
        console.log(
            res.data.collectionLog.tabs.Other["All Pets"].items.filter((i) => {
                return i.obtained;
            }).length
        );
    });
