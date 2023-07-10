import { spawn } from "child_process";
import { ChatInputCommandInteraction, SlashCommandBuilder, Message } from "discord.js";

import dotenv from "dotenv";
dotenv.config();

module.exports = {
	data: new SlashCommandBuilder().setName("deploy").setDescription("Deploys to dsns.dev!"),
	async execute(interaction: ChatInputCommandInteraction) {
		let output = "```ansi\n";
		await interaction.reply({ content: "Running deploy.py...", ephemeral: true });

		// adding -u as an argument prevents buffering of stdout
		const script = spawn("python", ["-u", process.env["SCRIPT_PATH"] || ""], {
			detached: true
		});

		script.stdout.on("data", async (data: Buffer) => {
			if (output.length + data.toString().length < 1987) {
				output += data.toString();
			} else {
				output = "```ansi\n[... continued]";
				output += data.toString();
			}

			await interaction.editReply({ content: output + "```" });
		});
	}
};
