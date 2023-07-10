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
			try {
				if (output.length + data.toString().length < 1960) {
					output += data.toString();
				} else {
					let combinedOutput = output + data.toString();
					let combinedOutputArray = combinedOutput.split("\n");

					while (combinedOutput.length > 1960) {
						combinedOutputArray.shift();
						combinedOutput = combinedOutputArray.join("\n");
					}

					output = "```ansi\n[...continued]\n" + combinedOutput;
				}

				await interaction.editReply({ content: output + "```" });
			} catch (error) {
				console.error(error);

				output = "```ansi\nError while running command, attempting to recover.";
				await interaction.editReply({ content: output + "```" });
			}
		});
	}
};
