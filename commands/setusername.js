const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');
const err = require('../returncodes.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setusername')
        .setDescription('Change your username to something else.')
        .addStringOption(option =>
            option.setName("username")
                .setDescription("The new username you want to use.")
                .setRequired(true)),
    async execute(interaction){
        var userid = interaction.user.id;
        var terminalid = interaction.channelId;
        var username = interaction.options.getString("username");

        if(!dh.checkTerminalLegitimacy(terminalid)){
            await interaction.reply({content: "Please perform this action in a valid chatroom terminal!", ephemeral: true });
            return;
        }
        var chatroomid = dh.retrieveChatroomForTerminal(terminalid);

        if(!dh.isUser(chatroomid, userid)){
            await interaction.reply({content: "You are not a user! Please contact an admin to be added to the chatroom.", ephemeral: true });
            return;
        }

        if(!dh.isRegisteredUser(chatroomid, userid)){
            await interaction.reply({content: "You have to register yourself first! Use /register and pick a username and profile picture."});
            return;
        }

        var returncode = dh.updateUsername(chatroomid, userid, username);
        if(returncode != err.GOOD_EXECUTE){
            console.log(`updateusername returncode: ${returncode}`);
            await interaction.reply({ content: "Something went wrong when setting your username! Make sure it's a string of under 80 characters.", ephemeral: true});
            return;
        }

        await interaction.reply({content: `Your username has been changed to: ${username}`, ephemeral: true});
    }
}