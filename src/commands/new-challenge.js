const newChallenge = {
	name: 'new-challenge',
	description: 'Cria um novo desafio',
	execute(message, args) {
		message.channel.send('Ok, vamos criar um novo desafio!');
	},
};

export default newChallenge;