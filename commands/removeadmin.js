const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeadmin')
        .setDescription('(Owner Only) Remove an admin from your chatroom.')
        .addStringOption(option =>
            option.setName('chatroomname')
                .setDescription('The name of the chatroom you\'d like to remove the admin from.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('admin')
                .setDescription("The admin you'd like to remove.")
                .setRequired(true)),
    async execute(interaction){
        var ownerid = interaction.user.id;
        var adminid = interaction.options.getUser('admin');
        var chatroomname = interaction.options.getString('chatroomname');

        if(!dh.isName(chatroomname))
        {
            await interaction.reply({ content: `${chatroomname} is not a recognized chatroom name!`, ephemeral: true});
            return;
        }

        var chatroomid = dh.retrieveId(chatroomname);

        if(!dh.isOwner(chatroomid, ownerid)){
            await interaction.reply({ content: `You are not the owner of ${chatroomname}!`, ephemeral: true});
            return;
        }

        if(!dh.isAdmin(chatroomid, adminid)){
            await interaction.reply({content: `<@${userid}> is not an admin for ${chatroomname}`, ephemeral: true});
            return;
        }

        var returncode = dh.removeAdmin(chatroomid, ownerid, adminid);
        console.log(`removeadmin returncode: ${returncode}`);

        await interaction.reply({content: `<@${adminid}> has been removed from their admin position in ${chatroomname}`});
    }
}