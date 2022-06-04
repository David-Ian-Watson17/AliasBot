const DEBUG = 0;

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

    switch(DEBUG)
    {
        case 1:
            const fwtests = require('./tests/filewritingtests.js');
            fwtests.runtests();
            break;
        case 2:
            const frtests = require('./tests/filereadingtests.js');
            frtests.runtests();
            break;
        case 3:
            const veriftests = require('./tests/verificationtests.js');
            veriftests.runtests();
            break;
        case 4:
            const dhtests = require('./tests/datahandlertests.js');
            dhtests.runtests();
            break;
        default:
            break;
    }
})

//client error handler
client.on('error', error => {
    console.log(error);
})

//login with token
client.login(require('./token.json').token);