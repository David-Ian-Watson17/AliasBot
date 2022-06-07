const DEBUG = 0;

//get client and token
const clientfile = require('./client.js');
const client = clientfile.client();
const token = require('./token.json').token;

//get resources for slash commands
const REST = require('@discordjs/rest').REST;
const Routes = require('discord-api-types/v9').Routes;
const fs = require('fs');
const Discord = require('discord.js');

//create command list to be populated
const commandlist = [];

//get message handler
var chatroomhandler = require('./chatroomcode/chatroomhandler.js');

//signal readiness
client.once('ready', async () => {    
    chatroomhandler.runChatroomHandler();

    client.commands = new Discord.Collection();
    const commandFiles = fs.readdirSync(`./commands`).filter(file => file.endsWith('.js'));
    const slashcommands = [];

    for(const file of commandFiles) {
        try{
            const command = require(`./commands/${file}`);
            client.commands.set(command.data.name, command);
            slashcommands.push(command.data.toJSON());
        }catch(error){console.log(error);}
    }

    const rest = new REST({ version: '9' }).setToken(token);

    (async () => {
        try{
            console.log('Started refreshing application (/) commands.');

            await rest.put(
                Routes.applicationCommands(client.user.id),
                { body: slashcommands },
            );

            console.log('Successfully reloaded application (/) commands.');
        } catch (error) {
            console.error(error);
        }
    })();

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

client.on('interactionCreate', async interaction => {
    if(!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if(!command) return;

    try{
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});

//client error handler
client.on('error', error => {
    console.log(error);
})

//login with token
client.login(require('./token.json').token);