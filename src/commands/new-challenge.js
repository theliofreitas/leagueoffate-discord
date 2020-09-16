import Discord from 'discord.js';
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
		const userAvatar = message.author.avatar;

		const user = await findUser(userId, message);
		if (!user) {
			message.reply(`seu usuário ainda não tem nenhuma conta do LoL verificada. :x: Utilize o comando \`/lof-start\` para vincular uma conta.`);
			return;
		}

		const userHasOpenChallenges = await getUserChallenges(user.summonerName, message);
		if(userHasOpenChallenges) return;

		const generatedCriterials = generateChallengeCriterials();

		const challenge = await createChallenge(user.summonerName, generatedCriterials, message);
		if(!challenge) return;

		message.reply('desafio criado!');

		const embedCriterials = [];

		for (let i = 0; i < challenge.criterials.length; i++) {
			const criterial = challenge.criterials[i];
			embedCriterials.push({
				name: `# Critério ${i}`,
				value: criterial.description
			})
		}

		const embedChallenge = new Discord.MessageEmbed()
		.setColor('#fcba03')
		.setTitle(`:trophy:  ${challenge.summonerName}`)
		.setDescription(`Novo desafio!`)
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
			message.reply('seu usuário já possui um desafio em andamento.');
			message.channel.send('Você pode abandonar seus desafios existentes utilizando o comando \`/quit-challenges\`');
			
			return true;
		}

		return false;
	}
	else {
		message.reply(`Ocorreu um erro ao consultar os serviços do League of Fate. Tente novamente mais tarde. \`Error: ${response.status}\``);
		return true;
	}
}

async function createChallenge(summonerName, generatedCriterials, message) {
	const criterials = [];
	
	generatedCriterials.map((generatedCriterial) => {
		const criterial = {
			field: generatedCriterial.field,
			operator: generatedCriterial.operator,
			value: generatedCriterial.value.toString(),
			description: generatedCriterial.description,
		}
		
		criterials.push(criterial);
	});
	
	const challenge = {
		summonerName: summonerName,
		criterials: criterials
	}

	const { response, data } = await LOFService.createChallenge(challenge);
	if (response.status === 201) {
		return data;
	}
	else {
		message.reply(`Ocorreu um erro ao consultar os serviços do League of Fate. Tente novamente mais tarde. \`Error: ${response.status}\``);
		return false;
	}
}

export default newChallenge;