import RiotService from './../services/RiotService';

const lofStart = {
	name: 'lof-start',
	description: 'Vincula conta do League of Legends ao usuário Discord',
	cooldown: 5,
	args: true,
	errorMessage: 'Você precisa informar um nome de invocador do LoL. Exemplo:',
	usage: 'LeoManeiro01',
	async execute(message, args) {
		const summonerName = message.content.substr(message.content.indexOf(' ')+1);
		message.channel.send(`Seu nick é: ${summonerName}`);

		if (message.channel.type !== 'dm') {
			message.reply('a vinculação de contas só pode ser feita via Direct Message. Utilize este comando no chat privado');
			return;
		}

		const teste = await RiotService.getSummonerId(summonerName);
		message.reply(teste.id);

	},
};

export default lofStart;