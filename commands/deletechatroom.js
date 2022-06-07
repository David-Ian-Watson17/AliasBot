const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deletechatroom')
        .setDescription('(Owner only) Delete a chatroom you\'re the owner of.')
        .addStringOption(option =>
            option.setName('chatroomname')
                .setDescription('The name of the chatroom you\'ld like to delete.')
                .setRequired(true)),
    async execute(interaction){
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

        dh.deleteChatroom(chatroomid, interaction.user.id);

        await interaction.reply({ content: `${chatroomname} deleted!`, ephemeral: true});
    }
}