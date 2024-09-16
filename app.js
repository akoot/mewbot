const express = require('express');
const bodyParser = require('body-parser');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const port = 80;

// Discord bot token (replace with your actual bot token)
const DISCORD_BOT_TOKEN = process.env.DISCORD_TOKEN

// Set up the Discord bot client
const discordClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

// When the Discord bot is ready
discordClient.once('ready', () => {
    console.log('Discord bot is ready!');
    app.responseT
});

// Log in to Discord
discordClient.login(DISCORD_BOT_TOKEN);

// Middleware to parse incoming requests as JSON
app.use(bodyParser.json());

// GroupMe webhook endpoint
app.post('/mewbot/', (req, res) => {
    const message = req.body;

    // Discord guild and channel IDs
    const guildId = String(process.env.GUILD_ID);
    const channelId = String(process.env.CHANNEL_ID);

    // Fetch the Discord guild and channel
    const guild = discordClient.guilds.cache.get(guildId);
    const channel = guild.channels.cache.get(channelId);

    // Send the message to the Discord channel
    if (channel && message.text) {
        channel.send(message.text);
    } else {
        console.log('Could not find the Discord channel or the message didn\'t contain text');
    }

    // Send a '200 OK' response to acknowledge the message
    res.status(200)
});

// Start the server
app.listen(port, () => {
    console.log(`Bot is listening at http://localhost:${port}`);
});

// Serve public files
app.use(express.static(__dirname + '/public'));
