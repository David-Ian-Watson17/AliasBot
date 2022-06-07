const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('createchatroom')
        .setDescription('Creates a chatroom with you as the owner.')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The name of the chatroom')
                .setRequired(true)),
    async execute(interaction) {
        var name = interaction.options.getString('name');
        if(dh.isName(name))
        {
            await interaction.reply({content: 'Sorry, that chatroom name is already taken!', ephemeral: true});
            return;
        }
        dh.createChatroom(interaction.user.id, name);
        await interaction.reply({content: `Chatroom \"${name}\" was created successfully!`, ephemeral: true});
    }
}