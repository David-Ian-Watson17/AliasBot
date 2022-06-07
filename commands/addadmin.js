const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('addadmin')
        .setDescription('(Owner Only) Adds another discord user as an admin for your chatroom.')
        .addStringOption(option => 
            option.setName('chatroomname')
                .setDescription("The name of the chatroom you want to add an admin to.")
                .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to appoint an admin.')
                .setRequired(true)),
    async execute(interaction){
        var userid = interaction.options.getUser('user').id;
        var chatroomname = interaction.options.getString('chatroomname');

        if(!dh.isName(chatroomname))
        {
            await interaction.reply({ content: `${chatroomname} is not a recognized chatroom name!`, ephemeral: true});
            return;
        }

        var chatroomid = dh.retrieveId(chatroomname);

        if(!dh.isOwner(chatroomid, interaction.user.id)){
            await interaction.reply({ content: `You are not the owner of ${chatroomname}!`, ephemeral: true});
            return;
        }

        if(dh.isAdmin(chatroomid, userid)){
            await interaction.reply({content: `<@${userid}> is already an admin for ${chatroomname}`, ephemeral: true});
            return;
        }

        var returncode = dh.addAdmin(chatroomid, interaction.user.id, userid);
        console.log(`addAdmin returncode: ${returncode}`);

        await interaction.reply({content: `<@${userid}> added successfully as an admin to ${chatroomname}!`, ephemeral: true });
    }
}