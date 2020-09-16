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

    console.log(lastMatchId);

    // validateChallenge(challengeId, lastMatchId, message);
    


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


export default checkChallenge;