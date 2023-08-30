import { allCatcher } from './errors/handling.js';
import { rollDice } from './utils/utils.js';

export function getDiceRoll(msg) {
  try {
    const diceRoll = rollDice();
    const author = `${msg.author.username}`;

    const message = `${author} rolled the dice and got a...\n\n${diceRoll}`;
    msg.channel.send(message);
  } catch (e) {
    allCatcher(e, msg);
  }
}
