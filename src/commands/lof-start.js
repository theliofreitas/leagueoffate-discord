import Discord from 'discord.js';
import RiotService from './../services/RiotService';
import User from '../models/User';

const lofStart = {
	name: 'lof-start',
	description: 'Vincula conta do League of Legends ao usuário Discord',
	cooldown: 5,
	args: true,
	errorMessage: 'Você precisa informar um nome de invocador do LoL. Exemplo:',
	usage: 'LeoManeiro01',

	async execute(message, args) {
		const summonerName = message.content.substr(message.content.indexOf(' ')+1);

		if (message.channel.type !== 'dm') {
			message.reply('a vinculação de contas só pode ser feita via Direct Message. Utilize este comando no chat privado');
			return;
		}

		const userExists = await validateUserExist(summonerName, message);
		if (userExists) return;

		const summonerData = await validateSummonerName(summonerName, message);
		if (!summonerData) return;

		// Validação por ícone
		message.reply(`Seja bem-vindo, **${summonerName}**!`);
		message.reply('Encontrei o seu perfil:');

		const embedSummonerProfile = new Discord.MessageEmbed()
			.setColor('#fcba03')
			.setTitle(summonerName)
			.setThumbnail(`http://ddragon.leagueoflegends.com/cdn/10.18.1/img/profileicon/${summonerData.profileIconId}.png`)
			.addFields(
				{ name: 'Level', value: summonerData.summonerLevel }
			);

		message.reply(embedSummonerProfile);

		const randomIconId = Math.floor(Math.random() * 29);
		const iconMessage = await generateIconMessage(randomIconId, message);
		iconMessage.react("👍");

		const filter = (reaction, user) => {
			return reaction.emoji.name === '👍' && user.id !== iconMessage.author.id;
		};

		const reactionResult = await iconMessage.awaitReactions(filter, { max: 1, time: 120000, errors: ['time'] })
		.then(collected => {
			const reaction = collected.first();

			if (reaction.emoji.name === '👍') {
				return true;
			}
		})
		.catch(collected => {
			iconMessage.reply(':x: O tempo para confirmar sua conta expirou. Execute o comando `/lof-start` novamente');
			return false;
		});

		if(!reactionResult) return;

		const iconIsValid = await validateSummonerIcon(summonerName, randomIconId, message);
		if (!iconIsValid) return;

		message.reply(':white_check_mark: Ícone válido. Conta confirmada!');
		
		const userId = message.channel.recipient.id;
		const userToCreate = {
			userId: userId,
			summonerId: summonerData.id,
			summonerName: summonerName
		}

		try {
			const user = await User.create(userToCreate);
			message.reply(':white_check_mark: Usuário cadastrado');
		}
		catch (err) {
			throw new Error(err);
		}
	},
};

async function validateUserExist(summonerName, message) {
	const user = await User.findOne({ summonerName: summonerName });

	if(!user) {
		return false;
	}
	else {
		message.reply(`:x: O usuário ${summonerName} já está vinculado à outra conta do Discord`);
		return true;
	}
}

async function validateSummonerName(summonerName, message) {
	const { response, data } = await RiotService.getSummonerId(summonerName);

	if (response.status === 200) {
		return {
			id: data.id,
			profileIconId: data.profileIconId,
			summonerLevel: data.summonerLevel
		}
	}
	else if (response.status === 404) {
		message.reply(':x: O nome de invocador informado não existe');
		return;
	}
	else {
		message.reply('Ocorreu um erro ao consultar os serviços da Riot Games. Tente novamente mais tarde');
		return;
	}
}

async function generateIconMessage(randomIconId, message) {
	const iconMessage = 
		await message.reply('Vá até sua conta do League of Legends e selecione o ícone abaixo:', {
			files: [
				`http://ddragon.leagueoflegends.com/cdn/6.3.1/img/profileicon/${randomIconId}.png`
			]
		})
		.then((iconMessage) => iconMessage);

	message.reply('Após trocar o ícone, clique no jóinha 👍');
	
	return iconMessage;
}

async function validateSummonerIcon(summonerName, randomIconId, message) {
	const { response, data } = await RiotService.getSummonerId(summonerName);

	if (response.status === 200) {
		if (data.profileIconId === randomIconId) {
			return true;
		} else {
			message.reply(':x: O ícone da sua conta não corresponde ao ícone solicitado. Tente novamente');
			return false;
		}
	}
	else if (response.status === 404) {
		message.reply(':x: O nome de invocador informado não existe');
		return;
	}
	else {
		message.reply('Ocorreu um erro ao consultar os serviços da Riot Games. Tente novamente mais tarde');
		return;
	}
}

export default lofStart;