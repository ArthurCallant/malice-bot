import { Client, Message } from 'discord.js';

export function isAuthorAdmin(msg: Message) {
  return msg.member.roles.cache.some((role) => role.name === 'Admin');
}
