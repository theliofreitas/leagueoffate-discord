import Discord from 'discord.js';
import dotenv from 'dotenv';
import { prefix } from './config.json';

import newChallenge from './commands/new-challenge.js';

dotenv.config();

const token = process.env.DISCORD_TOKEN;

const client = new Discord.Client();
client.commands = new Discord.Collection();

// set a new item in the Collection
// with the key as the command name and the value as the exported module
client.commands.set('new-challenge', newChallenge);

// when the client is ready, run this code
// this event will only trigger one time after logging in
client.once('ready', () => {
	
});

client.login(token);

client.on('message', message => {

  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  // Removes the first element from an array and returns it.
  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Ocorreu um erro ao tentar executar o comando');
  }

  // const taggedUser = message.mentions.users.first();
  // message.reply('Ok!');
  // message.channel.send(`Um novo desafio para: ${taggedUser.username}`);
  // message.channel.send(`Your username: ${message.author.username}\nYour ID: ${message.author.id}`);
});