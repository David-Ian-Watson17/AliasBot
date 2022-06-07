const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeuser')
        .setDescription('(Admin Required) Remove a user from a chatroom.')
        .addStringOption(option =>
            option.setName('chatroomname')
                .setDescription('The name of the chatroom you\'d like to remove a user from.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you\'d like to remove from the chatroom.')
                .setRequired(true)),
    async execute(interaction){
        var adminid = interaction.user.id;
        var userid = interaction.options.getUser('user').id;
        var chatroomname = interaction.options.getString('chatroomname');

        if(!dh.isName(chatroomname))
        {
            await interaction.reply({ content: `${chatroomname} is not a recognized chatroom name!`, ephemeral: true});
            return;
        }

        var chatroomid = dh.retrieveId(chatroomname);

        if(!dh.isAdmin(chatroomid, adminid)){
            await interaction.reply({ content: `You are not an admin for ${chatroomname}!`, ephemeral: true});
            return;
        }

        if(!dh.isUser(chatroomid, userid)){
            await interaction.reply({content: `<@${userid}> is not a user in ${chatroomname}`, ephemeral: true});
            return;
        }

        var returncode = dh.removeUser(chatroomid, adminid, userid);
        console.log(`removeuser returncode: ${returncode}`);

        await interaction.reply({content: `<@${userid}> has been removed as a user in ${chatroomname}!`});
    }
}