const { spawn } = require("child_process")
const { SlashCommandBuilder } = require("discord.js");

require("dotenv").config();

module.exports = {
	data: new SlashCommandBuilder().setName("deploy").setDescription("Deploys to dsns.dev!"),
	async execute(interaction) {
		let output = "```ansi\n";
		await interaction.reply({ content: "Running deploy.py...", ephemeral: true });

		const script = spawn("python", ["-u", process.env["SCRIPT_PATH"]], {
			detached: true
		});

		script.stdout.on("data", async (data) => {
			output += data.toString();
			await interaction.editReply({ content: output + "```", ephemeral: true });
		});
	}
};
