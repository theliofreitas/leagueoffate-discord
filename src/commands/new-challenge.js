const newChallenge = {
	name: 'new-challenge',
	description: 'Cria um novo desafio',
	args: true,
	usage: 'SummonerName',
	cooldown: 5,
	execute(message, args) {
		message.channel.send('Ok, vamos criar um novo desafio!');
	},
};

export default newChallenge;