# DeployBot

A deployment solution for dsns.dev using discord.js.

This bot will execute a Python script when run with /deploy, then display the output in Discord.

## How To Install

### 1. Clone the Github Repository:

	git clone https://github.com/dsnsgithub/deploybot

### 2. Enter the repository and install dependencies:

	cd deploybot
	npm install

### 3. Create a `.env` file and add these properties:

	GUILD_ID = [id from guild where you want to send chat messages]
	DISCORD_BOT_TOKEN = [create a discord bot in the developer portal and add the token here]
	CLIENT_ID = [discord bot client id, found in discord developer portal] 
	SCRIPT_PATH = [complete path to your python script]

### 4. Register Discord Slash Commands:

    node deploy-commands.js

### 5. Run the Discord Bot:

    node .
