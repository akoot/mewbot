// Imports
const express = require('express')
const bodyParser = require('body-parser')
const { Client, GatewayIntentBits } = require('discord.js')

// Express variables
const app = express()
const port = 80

// Environment variables
const DISCORD_BOT_TOKEN = process.env.DISCORD_TOKEN
const GUILD_ID = process.env.GUILD_ID
const CHANNEL_ID = process.env.CHANNEL_ID
const devMode = process.env.NODE_ENV === "development"

// Path variable
const path = '/'

// Set up the Discord bot client
const discordClient = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
})

// When the Discord bot is ready
discordClient.once('ready', () => {
    if(!devMode) return
    console.log('Discord bot is ready!')
})

// Log in to Discord
discordClient.login(DISCORD_BOT_TOKEN)

// Middleware to parse incoming requests as JSON
app.use(bodyParser.json())

// GroupMe webhook endpoint
app.post(path, (req, res) => {
    const message = req.body

    // Fetch the Discord guild
    const guild = discordClient.guilds.cache.get(GUILD_ID)
    if (!guild) {
        res.status(500).send({
            status: 'error',
            message: 'Invalid GUILD_ID'
        })
        return
    }

    // Fetch the Discord channel
    const channel = guild.channels.cache.get(CHANNEL_ID)
    if (!channel) {
        res.status(500).send({
            status: 'error',
            message: 'Invalid CHANNEL_ID'
        })
        return
    }

    // Send the message to the Discord channel
    let text = message.text
    let attachments = message.attachments
    let name = message.name

    // Create the message
    let prefix = `**${name}** » `
    let finalMessage = prefix

    // Add text to the message if it has text
    if(text) finalMessage += text
    channel.send(finalMessage)

    // If there are no attachments, then send '200 OK' and return
    if (!attachments) {
        res.sendStatus(200)
        return
    }

    // Add attachments if it has them
    for(let attachment of attachments) {
        let url
        if(attachment.type == "location") url = `[${attachment.name}](https://www.google.com/maps/@${attachment.lat},${attachment.lng},15z)`
        else if(attachment.type == "image") url = attachment.url
        if(url) {
            channel.send(url)
        }
    }

    // Send a '200 OK' response to acknowledge the message
    res.sendStatus(200)
});

// Start the server
app.listen(port, () => {
    if(!devMode) return
    console.log(`Bot is listening at http://localhost:${port}`)
});

// Serve public files (it's free real estate)
app.use(express.static(__dirname + '/public'))
