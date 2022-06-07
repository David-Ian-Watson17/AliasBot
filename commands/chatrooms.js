const SlashCommandBuilder = require('@discordjs/builders').SlashCommandBuilder;
const dh = require('../chatroomcode/datahandler.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chatrooms')
        .setDescription('Displays all chatrooms you are a part of, as well as your status in them.'),
    async execute(interaction) {
        var authorid = interaction.user.id;
        var ownerlist = dh.retrieveOwnerMapping(authorid);
        var admintemplist = dh.retrieveAdminMapping(authorid);
        var userlist = dh.retrieveUserMapping(authorid);
        var adminlist = [];

        console.log(userlist);

        //filter out all the chatrooms user is an owner in from adminlist
        admintemplist.forEach(item => {
            if(!ownerlist.includes(item)){
                adminlist.push(item);
            }
        })

        //fill in names instead of ids
        ownerlist.forEach(function(item, index){
            ownerlist[index] = dh.retrieveName(item);
        })
        adminlist.forEach(function(item, index){
            adminlist[index] = dh.retrieveName(item);
        })
        userlist.forEach(function(item, index){
            userlist[index] = dh.retrieveName(item);
        })

        //if not a part of any chatrooms, return
        if(ownerlist.length == 0 && adminlist.length == 0 && userlist.length == 0){
            await interaction.reply({ content: "You are not currently a part of any chatrooms!", ephemeral: true });
            return;
        }

        //prep reply
        var replystr = "Here are the chatrooms you are a part of and your position in them!\n\n";
        if(ownerlist.length > 0)
        {
            replystr += "__OWNER__\n";
            ownerlist.forEach(chatroom => {
                replystr += `${chatroom}\n`;
            })
            replystr += "\n";
        }
        if(adminlist.length > 0)
        {
            replystr += "__ADMIN__\n";
            adminlist.forEach(chatroom => {
                replystr += `${chatroom}\n`;
            })
            replystr += "\n";
        }
        if(userlist.length > 0)
        {
            replystr += "__USER__\n";
            userlist.forEach(chatroom => {
                replystr += `${chatroom}\n`;
            })
        }

        //reply full list
        await interaction.reply({ content: replystr, ephemeral: true })
    }
}