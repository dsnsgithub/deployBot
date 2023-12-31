import dotenv from "dotenv";
dotenv.config();

import { CommandInteraction, REST, Routes, SlashCommandBuilder } from "discord.js";

const token = process.env["DISCORD_BOT_TOKEN"];
const clientId = process.env["CLIENT_ID"];
const guildId = process.env["GUILD_ID"];
import fs from "fs";
import path from "path";

const commands: Object[] = [];
// Grab all the command files from the commands directory you created earlier
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

interface Command {
	data: SlashCommandBuilder;
	execute: Promise<void>;
}

for (const folder of commandFolders) {
	// Grab all the command files from the commands directory you created earlier
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith(".ts"));
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command: Command = require(filePath);
		if ("data" in command && "execute" in command) {
			commands.push(command.data.toJSON());
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token || "");

// and deploy your commands!
(async () => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = await rest.put(Routes.applicationGuildCommands(clientId || "", guildId || ""), { body: commands });

		console.log(`Successfully reloaded ${(data || "").toString().length} application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
