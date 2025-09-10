require('dotenv').config({quiet:true});
const n8nSpendWebhook = process.env.N8N_SPEND_WEBHOOK;
const { SlashCommandBuilder, spoiler } = require('discord.js');
// const ytLinkGetter = (str) => {
// 	const splitStr = str.split("/");
// 	let res = false
// 	for (let i of splitStr) {
// 		if (i === "www.youtube.com" || i === "youtu.be") {
// 			res = true;
// 			break;
// 		}
// 	}
// 	return res;
// };

module.exports = {
	data: new SlashCommandBuilder()
		.setName('money-recap')
		.setDescription('recap spending and earning')
		.addStringOption(option =>
            option.setName('status')
                .setDescription('status of note (earning/spending)')
                .setRequired(true))
		.addIntegerOption(option => 
			option.setName('nominal')
				.setDescription('Nominal to be inputted')
				.setMinValue(0))
		.addStringOption(option =>
			option.setName('note')
				.setDescription('note of spending or earning')
				.setRequired(false)),
	async execute(interaction) {
		const statusCode = interaction.options.getString('status');
		const nominalNum = interaction.options.getInteger('nominal');
		const spendNote = interaction.options.getString('note')
		const allowedStatus = ["spending", "earning"]
		if (statusCode.includes(allowedStatus)) {
			await interaction.reply({ content: 'bukan status yang benar', ephemeral: true})
		}

		try {
			const response = await fetch(n8nSpendWebhook, {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ 
				status : statusCode,
				nominal: nominalNum,
				note: spendNote
			 }),
			});
	  
			if (!response.ok) throw new Error('n8n webhook failed');
	  
			await interaction.reply({ content: '✅ Nominal telah diinput', ephemeral: true });
		  } catch (error) {
			console.error(error);
			await interaction.reply({ content: '⚠️ Gagal kirim ke webhook', ephemeral: true });
		  }
	},
};