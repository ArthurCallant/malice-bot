"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
var utils_1 = require("@wise-old-man/utils");
var blacklist_1 = require("./constants/blacklist");
var Period = {
    FIVE_MIN: 'five_min',
    WEEK: 'week',
    DAY: 'day',
    MONTH: 'month',
    YEAR: 'year'
};
/**
 * This file is intended as a local work area, to test new features. Instead of needing to test in a discord environment, console.log your function results.
 * Don't use this file in production, don't create functions here that are to be imported elsewhere.
 * Consider this file as deprecated and always possible to be deleted.
 */
// Start your local development here
var womClient = new utils_1.WOMClient();
var groupId = process.env.GROUP_ID;
var fiya = 0;
var plein = 0;
var thrmy = 0;
for (var i = 0; i < 10000000; i++) {
    var number = Math.floor(Math.random() * blacklist_1.BLACKLIST.length);
    switch (number) {
        case 0:
            fiya++;
            break;
        case 1:
            plein++;
            break;
        case 2:
            thrmy++;
            break;
    }
    // console.log(BLACKLIST[number]);
}
console.log('Holy Fiya: ', fiya);
console.log('P lein: ', plein);
console.log('Thrmy: ', thrmy);
var max = Math.max(fiya, plein, thrmy);
if (max === fiya) {
    console.log('You should ban Holy Fiya');
}
if (max === plein) {
    console.log('You should ban P lein');
}
if (max === thrmy) {
    console.log('You should ban Thrmy');
}
