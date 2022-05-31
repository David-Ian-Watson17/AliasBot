//import Discord
const Discord = require('discord.js');

//get client
const clientfile = require('./client.js');
const client = clientfile.client();

//get prefix
const prefix = "!?";

//fs for reading from/writing to files
const fs = require('fs');

//command handler
var commands;

//signal readiness
client.once('ready', async () => {
    console.log('Aliasbot is online!');
    const guildId = '981286460449783809';
    const guild = client.guilds.cache.get(guildId);
    
    if(guild)
        commands = guild.commands;
    else
        commands = client.application?.commands;
    
    commands?.create({
        name: 'ping',
        description: 'Replies with pong.',
    })
})

//client error handler
client.on('error', error => {
    console.log(error);
})

//login with token
client.login(require('./token.json').token);