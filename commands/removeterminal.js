const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removeterminal')
        .setDescription('(Admin Required) Remove a terminal channel from a chatroom.')
        .addStringOption(option =>
            option.setName('chatroomname')
                .setDescription('The name of the chatroom you\'d like to remove a terminal from.')
                .setRequired(true))
        .addChannelOption(option =>
            option.setName('terminal')
                .setDescription('The channel you\'d like to stop being a terminal.')
                .setRequired(true)),
    async execute(interaction){
        var adminid = interaction.user.id;
        var chatroomname = interaction.options.getString('chatroomname');
        var terminalid = interaction.options.getChannel('terminal').id;

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

        if(!dh.isTerminal(chatroomid, terminalid)){
            await interaction.reply({content: `<#${terminalid}> is not a terminal in ${chatroomname}`, ephemeral: true});
            return;
        }

        var returncode = dh.removeTerminal(chatroomid, adminid, terminalid);
        console.log(`removeterminal returncode: ${returncode}`);

        await interaction.reply({ content: `<#${terminalid}> has been removed from ${chatroomname} as a terminal.`});
    }
}