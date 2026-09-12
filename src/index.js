require('dotenv').config();
const { Client, GatewayIntentBits, Collection, REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const http = require('http');

// Initialize Discord Client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages
    ]
});

client.commands = new Collection();
const slashCommandsData = [];

// Load Command Handlers
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = require(filePath);

    if (Array.isArray(commandModule.commands)) {
        for (const cmd of commandModule.commands) {
            client.commands.set(cmd.data.name, cmd);
            slashCommandsData.push(cmd.data.toJSON());
        }
    } else if (commandModule.data && commandModule.execute) {
        client.commands.set(commandModule.data.name, commandModule);
        slashCommandsData.push(commandModule.data.toJSON());
    }
}

// Bot Ready Event
client.once('ready', async () => {
    console.log('═══════════════════════════════════════════════════');
    console.log(`🤖 AIMKILL KEY MANAGER ONLINE: Logged in as ${client.user.tag}`);
    console.log(`🆔 Client ID: ${client.user.id}`);
    console.log(`📡 Connected Servers: ${client.guilds.cache.size}`);
    console.log('═══════════════════════════════════════════════════');

    // Register / Sync Slash Commands with Discord API
    const token = process.env.DISCORD_TOKEN;
    if (!token || token === 'YOUR_DISCORD_BOT_TOKEN_HERE') {
        console.warn('⚠️ WARNING: DISCORD_TOKEN is not set in .env file!');
        return;
    }

    const rest = new REST({ version: '10' }).setToken(token);

    try {
        console.log(`🔄 Syncing ${slashCommandsData.length} slash commands with Discord...`);

        // Register globally for all servers
        await rest.put(
            Routes.applicationCommands(client.user.id),
            { body: slashCommandsData }
        );

        console.log('✅ Successfully registered global AIMKILL KEY MANAGER slash commands!');
    } catch (err) {
        console.error('❌ Failed to register slash commands:', err);
    }
});

// Slash Command Interaction Handler
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return;

    const command = client.commands.get(interaction.commandName);
    if (!command) {
        console.warn(`Command not found: ${interaction.commandName}`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(`Error executing ${interaction.commandName}:`, error);

        const errorMessage = {
            content: '⚠️ There was an unexpected error while executing this command!',
            ephemeral: true
        };

        if (interaction.deferred || interaction.replied) {
            await interaction.followUp(errorMessage).catch(() => {});
        } else {
            await interaction.reply(errorMessage).catch(() => {});
        }
    }
});

// 24/7 Cloud HTTP Health & Keep-Alive Server (For Render / Koyeb / UptimeRobot)
const PORT = process.env.PORT || 3000;
const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
        status: 'ONLINE',
        service: 'AIMKILL KEY MANAGER',
        bot_user: client.user ? client.user.tag : 'OFFLINE_OR_CONNECTING',
        guilds: client.guilds ? client.guilds.cache.size : 0,
        uptime_seconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString()
    }));
});

server.listen(PORT, () => {
    console.log(`🌐 24/7 Keep-Alive HTTP Server listening on port ${PORT}`);
});

// Graceful Exception Handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

// Login Bot
const token = process.env.DISCORD_TOKEN;
if (!token || token === 'YOUR_DISCORD_BOT_TOKEN_HERE') {
    console.log('═══════════════════════════════════════════════════');
    console.log('⚠️ PLEASE CONFIGURE YOUR DISCORD BOT TOKEN IN .env');
    console.log('1. Open the .env file');
    console.log('2. Replace YOUR_DISCORD_BOT_TOKEN_HERE with your token');
    console.log('3. Run `npm start` or start.bat again');
    console.log('═══════════════════════════════════════════════════');
} else {
    client.login(token).catch(err => {
        console.error('❌ Failed to login to Discord:', err.message);
    });
}
