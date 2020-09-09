const newChallenge = {
	name: 'lof-start',
	description: 'Vincula conta do League of Legends ao usuário Discord',
	cooldown: 5,
	args: true,
	errorMessage: 'Você precisa informar um nome de invocador do LoL. Exemplo:',
	usage: 'LeoManeiro01',
	execute(message, args) {
		const summonerName = message.content.substr(message.content.indexOf(' ')+1);

		message.channel.send(`Seu nick é: ${summonerName}`);
	},
};

export default newChallenge;