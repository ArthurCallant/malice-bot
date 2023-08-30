"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDiceRoll = void 0;
var handling_1 = require("./errors/handling");
var utils_1 = require("./utils/utils");
function getDiceRoll(msg) {
    try {
        var diceRoll = (0, utils_1.rollDice)();
        var author = "".concat(msg.author.username);
        var message = "".concat(author, " rolled the dice and got a...\n\n").concat(diceRoll);
        msg.channel.send(message);
    }
    catch (e) {
        (0, handling_1.allCatcher)(e, msg);
    }
}
exports.getDiceRoll = getDiceRoll;
