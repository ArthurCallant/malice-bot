import { Message } from 'discord.js';
import { allCatcher } from './errors/handling';
import { rollDice } from './utils/utils';

export function getDiceRoll(msg: Message) {
  try {
    const diceRoll = rollDice();
    const author = `${msg.author.username}`;

    const message = `${author} rolled the dice and got a...\n\n${diceRoll}`;
    msg.channel.send(message);
  } catch (e) {
    allCatcher(e, msg);
  }
}
