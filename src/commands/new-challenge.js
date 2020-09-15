import LOFService from '../services/LOFService';
import User from '../models/User';
import { generateChallengeCriterials } from '../helpers/challengeGenerator';

const newChallenge = {
	name: 'new-challenge',
	description: 'Cria um novo desafio',
	args: false,
	cooldown: 5,

	async execute(message, args) {
		const userId = message.author.id;

		const user = await findUser(userId, message);
		if (!user) {
			message.reply(`seu usuário ainda não tem nenhuma conta do LoL verificada. :x: Utilize o comando \`/lof-start\` para vincular uma conta.`);
			return;
		}

		const userHasOpenChallenges = await getUserChallenges(user.summonerName, message);
		if(userHasOpenChallenges) return;

		message.reply(`muito bem! Pronto para o desafio?`);

		// TODO: Create 
		// ...
		const challengeCriterials = generateChallengeCriterials();
		console.log(challengeCriterials);

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
			message.reply('seu usuário já possui um desafio em andamento.');
			message.channel.send('Você pode abandonar seus desafios existentes utilizando o comando \`/quit-challenges\`');
			
			return true;
		}

		return false;
	}
	else {
		message.reply('Ocorreu um erro ao consultar os serviços do League of Fate. Tente novamente mais tarde');
		return true;
	}
}

export default newChallenge;