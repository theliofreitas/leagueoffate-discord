import Discord from 'discord.js';
import dotenv from 'dotenv';
import { prefix } from './config.json';

import lofStart from './commands/lof-start.js';
import newChallenge from './commands/new-challenge.js';
import checkChallenge from './commands/check-challenge.js';

dotenv.config();

const token = process.env.DISCORD_TOKEN;

const client = new Discord.Client();
const cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();

// set a new item in the Collection
// with the key as the command name and the value as the exported module
client.commands.set('lof-start', lofStart);
client.commands.set('new-challenge', newChallenge);
client.commands.set('check-challenge', checkChallenge);

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

  // Verifica se os argumentos do comando estão corretos
  if (command.args && !args.length) {
    return message.channel.send(`${command.errorMessage} \`${prefix}${command.name} ${command.usage}\``);
  }



  // Cooldowns ------------
  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }
  
  const now = Date.now();
  const timestamps = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || 3) * 1000;
  
  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(`por favor espere ${timeLeft.toFixed(1)} segundo(s) para usar o comando \`${command.name}\` novamente.`);
    }
  } else {
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
  }
  // ----------------------


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