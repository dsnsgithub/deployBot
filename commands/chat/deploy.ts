import { spawn } from "child_process";
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import dotenv from "dotenv";
dotenv.config();

module.exports = {
	data: new SlashCommandBuilder().setName("deploy").setDescription("Deploys to dsns.dev!"),
	async execute(interaction: ChatInputCommandInteraction) {
		let output = "```ansi\n";
		let currentMessage: any = await interaction.reply({ content: "Running deploy.py...", ephemeral: true });

		// adding -u as an argument prevents buffering of stdout
		const script = spawn("python", ["-u", process.env["SCRIPT_PATH"] || ""], {
			detached: true
		});

		script.stdout.on("data", async (data: Buffer) => {
			try {
				if (output.length + data.toString().length < 1990) {
					output += data.toString();
					// output = output.replace(/[^\x00-\x7F]/g, "");
					// await interaction.editReply({ content: output + "```"});

					if (currentMessage) {
						currentMessage.edit({ content: output + "```" });
					}
				} else {
					output = "```ansi\n";
					output += data.toString();
					currentMessage = await interaction.followUp({ content: output + "```", ephemeral: true });
				}
			} catch (error) {
				output = "```ansi\nSomething went wrong, attempting to reset.\nError: " + error;
				await interaction.followUp({ content: output + "```", ephemeral: true });
			}
		});
	}
};
