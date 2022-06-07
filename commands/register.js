const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');
const err = require('../returncodes.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('User? Sign yourself up in a terminal with a username and profile picture.')
        .addStringOption(option => 
            option.setName('username')
            .setDescription('The name you wish to be known in this chatroom as. Up to 80 characters.')
            .setRequired(true))
        .addAttachmentOption(option =>
            option.setName('profilepicture')
            .setDescription('The image other users will see next to your name.')
            .setRequired(true)),
    async execute(interaction){
        var userid = interaction.user.id;
        var terminalid = interaction.channelId;
        var username = interaction.options.getString('username');
        var profilepicture = interaction.options.getAttachment('profilepicture').url;

        if(!dh.checkTerminalLegitimacy(terminalid)){
            await interaction.reply({content: "Please register yourself in a valid chatroom terminal!", ephemeral: true });
            return;
        }
        var chatroomid = dh.retrieveChatroomForTerminal(terminalid);

        if(!dh.isUser(chatroomid, userid)){
            await interaction.reply({content: "You are not a user! Please contact an admin to be added to the chatroom.", ephemeral: true });
            return;
        }

        if(dh.isRegisteredUser(chatroomid, userid)){
            await interaction.reply({content: "You are already registered! Use /setprofilepicture and /setusername to change appearance."});
            return;
        }

        var returncode1 = dh.updateUsername(chatroomid, userid, username);
        var returncode2 = dh.updateProfilePicture(chatroomid, userid, profilepicture);

        if(returncode1 != err.GOOD_EXECUTE){
            console.log(`updateusername failed, returncode: ${returncode1}`);
            await interaction.reply({content: "There was a problem setting your username! Make sure it is a string of less than 80 characters.", ephemeral: true});
            return;
        }

        if(returncode2 != err.GOOD_EXECUTE){
            console.log(`updateprofilepicture failed, returncode: ${returncode2}`);
            await interaction.reply({content: "There was a problem setting your profile picture!"});
            return;
        }

        var returncode = dh.register(chatroomid, userid);
        console.log(`register returncode: ${returncode}`);

        await interaction.reply({content: "Successfully registered! Try sending a message!", ephemeral: true});
    }
}