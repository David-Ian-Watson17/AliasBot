const { SlashCommandBuilder } = require('@discordjs/builders');
const mh = require('../chatroomcode/messagehandler.js');
const dh = require('../chatroomcode/datahandler.js');
const err = require('../returncodes.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setprofilepicture')
        .setDescription('Change your profile picture to something else.')
        .addAttachmentOption(option =>
            option.setName("profilepicture")
                .setDescription("The new profile picture you want to use.")
                .setRequired(true)),
    async execute(interaction){
        var userid = interaction.user.id;
        var terminalid = interaction.channelId;
        var profilepicture = interaction.options.getAttachment("profilepicture").url;

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

        var olduserdata = dh.retrieveUserData(chatroomid, userid);

        var returncode = dh.updateProfilePicture(chatroomid, userid, profilepicture);
        if(returncode != err.GOOD_EXECUTE){
            console.log(`updateProfilePicture returncode: ${returncode}`);
            await interaction.reply({content: "Something went wrong when setting your profile picture!", ephemeral: true});
            return;
        }

        //log change
        dh.logEvent(chatroomid, userid, "PP", `${olduserdata.username}  ${olduserdata.profilepic}  ${profilepicture}`);
        mh.updateEvent(chatroomid, "PP", {username: olduserdata.username, profilepic: profilepicture});

        await interaction.reply({content: "Your profile picture has been set to:", files: [profilepicture], ephemeral: true});
    }
}