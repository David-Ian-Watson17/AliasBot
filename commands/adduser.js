const { SlashCommandBuilder } = require('@discordjs/builders');
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('adduser')
        .setDescription('(Admin Required) Adds a discord user to a chatroom so they may use terminals.')
        .addStringOption(option =>
            option.setName('chatroomname')
                .setDescription('The name of the chatroom you want to add the user to.')
                .setRequired(true))
        .addUserOption(option =>
            option.setName('user')
                .setDescription('The user you want to add to the chatroom.')
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

        if(!dh.isAdmin(chatroomid, interaction.user.id)){
            await interaction.reply({ content: `You are not an admin for ${chatroomname}!`, ephemeral: true});
            return;
        }

        if(dh.isUser(chatroomid, userid)){
            await interaction.reply({content: `<@${userid}> is already a user in ${chatroomname}`, ephemeral: true});
            return;
        }

        var returncode = dh.addUser(chatroomid, interaction.user.id, userid);
        console.log(`addUser returncode: ${returncode}`);

        await interaction.reply({content: `<@${userid}> added successfully as a user to ${chatroomname}!`, ephemeral: true });
    }
}