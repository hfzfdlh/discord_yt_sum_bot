require('dotenv').config({quiet:true});
const n8nYtWebhook = process.env.N8N_YT_WEBHOOK;
const { SlashCommandBuilder, spoiler } = require('discord.js');
const ytLinkGetter = (str) => {
	const splitStr = str.split("/");
	let res = false
	for (let i of splitStr) {
		if (i === "www.youtube.com" || i === "youtu.be") {
			res = true;
			break;
		}
	}
	return res;
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('yt-sum')
		.setDescription('process youtube link')
		.addStringOption(option =>
            option.setName('input_url')
                .setDescription('youtube link URL')
                .setRequired(true)),
	async execute(interaction) {
		const inputURL = interaction.options.getString('input_url');
		if (!ytLinkGetter(inputURL)) {
			await interaction.reply({ content: 'bukan link youtube', ephemeral: true });
			return;
		}
		try {
			const response = await fetch(n8nYtWebhook, {
			  method: 'POST',
			  headers: { 'Content-Type': 'application/json' },
			  body: JSON.stringify({ url: inputURL }),
			});
	  
			if (!response.ok) throw new Error('n8n webhook failed');
	  
			await interaction.reply({ content: '✅ Link diproses', ephemeral: true });
		  } catch (error) {
			console.error(error);
			await interaction.reply({ content: '⚠️ Gagal kirim ke webhook', ephemeral: true });
		  }
	},
};