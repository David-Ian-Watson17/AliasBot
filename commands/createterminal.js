const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createterminal')
        .setDescription('(Admin Required) Create a chatroom terminal in a channel.')
        .addStringOption(option =>
            option.setName('chatroomname')
            .setDescription('The name of the chatroom youl\'d like to add the terminal to.')
            .setRequired(true))
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription('The channel you\'ld like to turn into a terminal.')
            .setRequired(true)),
    async execute(interaction){
        var channelid = interaction.options.getChannel('channel').id;
        var chatroomname = interaction.options.getString('chatroomname');
        
        if(!dh.isName(chatroomname))
        {
            await interaction.reply({ content: `${chatroomname} is not a recognized chatroom name!`, ephemeral: true});
            return;
        }

        var chatroomid = dh.retrieveId(chatroomname);

        if(!dh.isAdmin(chatroomid, interaction.user.id)){
            await interaction.reply({ content: `You are not an admin for ${chatroomname}!`, ephemeral: true});
            return;
        }

        if(dh.isTerminal(chatroomid, channelid)){
            await interaction.reply({ content: `<#${channelid}> is already a terminal in ${chatroomname}`, ephemeral: true });
            return;
        }

        var returncode = dh.addTerminal(chatroomid, interaction.user.id, channelid);
        console.log(`CreateTerminal returncode: ${returncode}`);

        await interaction.reply({ content: `<#${channelid}> successfully added to ${chatroomname} as a terminal!`, ephemeral: true});
    }
}