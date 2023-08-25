import { rollDice } from './utils/utils.js';

export function getDiceRoll(msg, user) {
  const diceRoll = rollDice();
  const author = `<@${msg.author.id}>`;

  const message = `${author} rolled the dice and got...\n\n\nA ${diceRoll}`;
  msg.channel.send(message);
}
