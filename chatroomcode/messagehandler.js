/*
MESSAGEHANDLER

This handles receiving of messages and performs checks to see if they need to be sent anywhere in the chatroom.

Function List
-------------
------------- Checkers
checkMessage
------------- Senders
sendMessage
*/
var Discord = require('discord.js');
var client = require('../client.js').client();
var err = require('../returncodes.json');
var dh = require('./datahandler');

var checkMessage = function(message){

    //no bots allowed
    if(message.author.bot)
        return;

    //check if channel is a terminal for a chatroom
    if(!dh.checkTerminalLegitimacy(message.channelId))
        return;

    //retrieve chatroom and save author and channel information
    var chatroom = dh.retrieveChatroomForTerminal(message.channelId);
    var authorid = message.author.id;
    var channel = message.channel;

    //check user status
    var authorlegitimacy = dh.checkAuthorLegitimacy(chatroom, authorid);
    if(authorlegitimacy == err.INVALID_USER_ID){
        message.delete();
        channel.send("You are not a user for this chatroom! Please contact an admin to be added.")
            .then(msg => {
                setTimeout(() => msg.delete(), 5000)
            }).catch(console.error);
        return;
    }
    if(authorlegitimacy == err.USER_NOT_REGISTERED){
        message.delete();
        channel.send("You are not registered to send messages in this chatroom yet! Use /register to pick a username and profile picture and register yourself to send messages!")
            .then(msg => {
                setTimeout(() => msg.delete(), 5000)
            }).catch(console.error);
        return;
    }
    if(authorlegitimacy != true){
        message.delete();
        return;
    }

    //retrieve remaining necessary information
    var sendingterminals = dh.retrieveTerminals(chatroom);
    var userdata = dh.retrieveUserData(chatroom, authorid);
    var content = message.content;
    var attachments = [];
    message.attachments.forEach(attachment => {
        attachments.push(attachment.attachment);
    })

    //delete message
    message.delete();

    //send message to all terminals
    sendMessage(sendingterminals, userdata.username, userdata.profilepic, content, attachments);

    //log event in the log
    dh.logEvent(chatroom, authorid, "M", content, attachments);
}

var sendMessage = function(channels, username, profilepicture, content, attachments){
    channels.forEach(channelid => {
        try{
            //retrieve channel for terminal
            var chn = client.channels.cache.get(channelid);

            if(chn == undefined){
                dh.brokenchannel(channelid);
            }

            //retrieve webhooks for channel
            chn.fetchWebhooks()
                .then(hooks => {
                    //find the first webhook created by this client
                    var foundhook = false;
                    hooks.forEach(hook => {
                        if(hook.client == client && foundhook == false){
                            if(content == ""){
                                hook.send({files: attachments, username: username, avatarURL: profilepicture})
                                    .catch(console.error);
                            }
                            else{
                                hook.send({content: content, files: attachments, username: username, avatarURL: profilepicture})
                                    .catch(console.error);
                            }
                            foundhook = true;
                        }
                    });
                    if(foundhook == false){
                        chn.createWebhook(`AliasbotHook`, {
                            reason: "Chatroom Webhook"
                        })
                            .then(hook => {
                                if(content == ""){
                                    hook.send({files: attachments, username: username, avatarURL: profilepicture})
                                        .catch(console.error);
                                }
                                else{
                                    hook.send({content: content, files: attachments, username: username, avatarURL: profilepicture})
                                        .catch(console.error);
                                }
                            })
                            .catch(console.error);
                    }
                })
        }catch(error){
            console.log(error);
        }
    })
}

var updateEvent = function(chatroomid, type, updateobject){
    var message = "";
    var title = "";
    var thumbnail = "";
    switch(type){
        case "UU":
            title = "Username Changed";
            var oldusername = updateobject.oldusername;
            var newusername = updateobject.newusername;
            message = `${oldusername} changed their name to ${newusername}.`;
            thumbnail = updateobject.profilepic;
            break;
        case "PP":
            title = "Profile Picture Changed";
            var username = updateobject.username;
            message = `${username} changed their profile picture.`;
            thumbnail = updateobject.profilepic;
            break;
        case "R":
            title = "New User";
            var username = updateobject.username;
            message = `${username} has joined the chatroom!`;
            thumbnail = updateobject.profilepic;
            break;
        default:
            break;
    }

    var terminals = dh.retrieveTerminals(chatroomid);
    sendUpdate(terminals, title, thumbnail, message);
}

var sendUpdate = function(terminals, title, thumbnail, message){
    //create embed
    var embed = new Discord.MessageEmbed()
        .setTitle(title)
        .setThumbnail(thumbnail)
        .setDescription(`*${message}*`);

    terminals.forEach(channelid => {
        var channel = client.channels.cache.get(channelid);
        channel.send({embeds: [embed]});
    })
}

module.exports = {
    checkMessage: checkMessage,
    updateEvent: updateEvent,
    sendMessage: sendMessage,
    sendUpdate: sendUpdate
}