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

		let message: Message;
		let createdMessage = false;
		script.stdout.on("data", async (data: Buffer) => {
			try {
				if (output.length + data.toString().length < 1987) {
					output += data.toString();
				} else {
					output = "```ansi\n";
					output += data.toString();
					createdMessage = false;
				}

				if (!createdMessage) {
					message = await interaction.followUp({ content: output + "```", ephemeral: true });
					createdMessage = true;
				} else {
					message.edit({ content: output + "```" });
				}

			} catch (error) {
				output = "```ansi\nSomething went wrong, attempting to reset.\nError: " + error;
				await interaction.followUp({ content: output + "```", ephemeral: true });
			}
		});
	}
};
