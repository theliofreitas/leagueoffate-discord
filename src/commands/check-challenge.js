import Discord from 'discord.js';
import LOFService from '../services/LOFService';
import RiotService from './../services/RiotService';
import User from '../models/User';

const checkChallenge = {
	name: 'check-challenge',
	description: 'Valida um desafio',
	args: false,
	cooldown: 5,

	async execute(message, args) {
    const userId = message.author.id;
		const userAvatar = message.author.avatar;

		const user = await findUser(userId, message);
		if (!user) {
			message.reply(`seu usuário ainda não tem nenhuma conta do LoL verificada. :x: Utilize o comando \`/lof-start\` para vincular uma conta.`);
			return;
    }
    
    const challenge = await getUserChallenges(user.summonerName, message);
    if(!challenge) return;

    const challengeId = challenge.id;

    const lastMatchId = await getLastMatchId(user.summonerName, message);
    if(!lastMatchId) return;

    const validatedChallenge = await validateChallenge(challengeId, lastMatchId, message);
    if(!validatedChallenge) return;

    const embedColor = validateChallenge.status === 'completed' ? '#4ad48a' : '#e85454';
    const embedCriterials = [];

		for (let i = 0; i < validatedChallenge.criterials.length; i++) {
			const criterial = validatedChallenge.criterials[i];
      const icon = criterial.result ? ':white_check_mark:' : ':x:';

			embedCriterials.push({
				name: `# Critério ${i}`,
        value: `${icon} ${criterial.description}`,
			})
		}

    const embedChallenge = new Discord.MessageEmbed()
		.setColor(embedColor)
		.setTitle(`:trophy:  ${validatedChallenge.summonerName}`)
		.setDescription(`Resultado do desafio!`)
		.setThumbnail(`https://cdn.discordapp.com/avatars/${userId}/${userAvatar}.png?size=128`)
		.addFields(
			{ name: '\u200B', value: '\u200B' },
			embedCriterials
		);

		message.reply(embedChallenge);
  },
};

async function findUser(userId) {
	const user = await User.findOne( {userId: userId });

	if (user) return user;

	return;
}

async function getUserChallenges(summonerName, message) {
	const { response, data } = await LOFService.getUserChallenges(summonerName);

	if (response.status === 200) {
		if (data.length) {
      return data[0];
		}
    message.reply('seu usuário não possui nenhum desafio em andamento.');
    message.channel.send('Você pode criar novos desafios utilizando o comando \`/new-challenge\`');
		return false;
	}
	else {
		message.reply(`Ocorreu um erro ao consultar os serviços do League of Fate. Tente novamente mais tarde. \`Error: ${response.status}\``);
		return false;
	}
}

async function getLastMatchId(summonerName, message) {
  const { response: summonerResponse, data: summonerData  } = await RiotService.getSummonerId(summonerName);
  let accountId;

	if (summonerResponse.status === 200) {
    accountId = summonerData.accountId;
	}
	else if (summonerResponse.status === 404) {
		message.reply(':x: O nome de invocador informado não existe');
		return;
	}
	else {
		message.reply('Ocorreu um erro ao consultar os serviços da Riot Games. Tente novamente mais tarde');
		return;
  }
  
  const { response: matchResponse, data: matchData  } = await RiotService.getLastMatch(accountId);
  let lastMatchId;

  if (matchResponse.status === 200) {
    lastMatchId = matchData.gameId;
    return lastMatchId;
	}
	else {
		message.reply('Ocorreu um erro ao consultar os serviços da Riot Games. Tente novamente mais tarde');
		return;
  }
}

async function validateChallenge(challengeId, lastMatchId, message) {
  const challenge = { matchId: lastMatchId }
  const { response: validateResponse } = await LOFService.validateChallenge(challengeId, challenge);

  if (validateResponse.status === 204) {
    const { response: challengeResponse, data: challengeData } = await LOFService.getChallengeById(challengeId);

    if( challengeResponse.status === 200) {
      return challengeData;
    }
    else if (challengeResponse.status === 404) {
      message.reply('o desafio enviado não existe');
      return false;
    }
    else {
      message.reply(`Ocorreu um erro ao consultar os serviços do League of Fate. Tente novamente mais tarde. \`Error: ${challengeResponse.status}\``);
      return false;
    }
  }
  else if (validateResponse.status === 404) {
		message.reply('o desafio enviado não existe');
		return false;
	}
	else {
		message.reply(`Ocorreu um erro ao consultar os serviços do League of Fate. Tente novamente mais tarde. \`Error: ${validateResponse.status}\``);
		return false;
	}
}

export default checkChallenge;