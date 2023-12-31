import { SlashCommandBuilder, ChatInputCommandInteraction } from "discord.js";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("echo")
		.setDescription("Echos back whatever you said!")
		.addStringOption((option) => option.setName("message").setDescription("Chat Message").setRequired(true)),
	async execute(interaction: ChatInputCommandInteraction) {
		const message = interaction.options.getString("message");
		await interaction.reply(message || "Nothing was said!");
	}
};
