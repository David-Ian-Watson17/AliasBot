/*
FILEREADING

This code page contains all the code necessary to obtain information from the various files the chatbot
uses.

These files are:

Universal Files
---------------
ownermapping.json
adminmapping.json
usermapping.json
channelmapping.json

Chatroom Files
--------------
chatroom.json
users.json
log.txt

List of Functions
-----------------
---------------- Universal Mapping functions
ownerOf
adminFor
userIn
terminalIn
---------------- Chatroom.json retrieval functions
isOwner
isAdmin
isTerminal
---------------- Users.json retrieval functions
isUser
isRegisteredUser
username
profilePicture
---------------- Largescale retrieval functions
retrieveAllChatroomIds
retrieveOwner
retrieveAdmins
retrieveTerminals
retrieveUsers
retrieveOwnerMapping
retrieveAdminMapping
retrieveTerminalMapping
retrieveUserMapping
---------------- Log retrieval functions
retrieveLog
*/

const fs = require('fs');
const err = require('../returncodes.json');

//ownerOf
//returns all the chatrooms in which a given discord user is the owner
//returns an array with all the chatroom ids they belong to
var ownerOf = function(userid){
    var ownerrawdata = fs.readFileSync(`./chatroommapping/ownermapping.json`);
    var ownerdata = JSON.parse(ownerrawdata.toString());
    if(ownerdata[`${userid}`])
        return ownerdata[`${userid}`];
    return [];
}

//adminFor
//returns all the chatrooms in which a given discord user is an admin
//returns an array with all the chatroom ids they belong to
var adminFor = function(userid){
    var adminrawdata = fs.readFileSync(`./chatroommapping/adminmapping.json`);
    var admindata = JSON.parse(adminrawdata.toString());
    if(admindata[`${userid}`])
        return admindata[`${userid}`];
    return [];
}

//userIn
//returns all the chatrooms in which a given discord user is a user
//returns an array with all the chatroom ids they belong to
var userIn = function(userid){
    var userrawdata = fs.readFileSync(`./chatroommapping/usermapping.json`);
    var userdata = JSON.parse(userrawdata.toString());
    if(userdata[`${userid}`])
        return userdata[`${userid}`];
    return [];
}

//terminalIn
//returns all the chatrooms in which a given channel is a terminal
//returns an array with all the chatroom ids it belongs to
var terminalIn = function(channelid){
    var terminalrawdata = fs.readFileSync(`./chatroommapping/channelmapping.json`);
    var terminaldata = JSON.parse(terminalrawdata.toString());
    if(terminaldata[`${channelid}`])
        return terminaldata[`${channelid}`];
    return "";
}

//isOwner
//returns whether a discord user is the owner of a given chatroom
//returns true if yes, false if no or the chatroom doesn't exist
var isOwner = function(chatroom, userid){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/chatroom.json`))
        {
            var chatroomrawdata = fs.readFileSync(`./chatrooms/${chatroom}/chatroom.json`);
            var chatroomdata = JSON.parse(chatroomrawdata.toString());
            if(chatroomdata.owner == `${userid}`)
                return true;
            return false;
        }
        return false;
    }
    return false;
}

//isAdmin
//returns whether a discord user is an admin in a given chatroom
//returns true if yes, false if no or the chatroom doesn't exist
var isAdmin = function(chatroom, userid){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/chatroom.json`))
        {
            var chatroomrawdata = fs.readFileSync(`./chatrooms/${chatroom}/chatroom.json`);
            var chatroomdata = JSON.parse(chatroomrawdata.toString());
            if(chatroomdata.admins.includes(`${userid}`))
                return true;
            return false;
        }
        return false;
    }
    return false;
}

//isTerminal
//returns whether a channel is a terminal in a given chatroom
//returns true if yes, false if no or the chatroom doesn't exist
var isTerminal = function(chatroom, channelid){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/chatroom.json`))
        {
            var chatroomrawdata = fs.readFileSync(`./chatrooms/${chatroom}/chatroom.json`);
            var chatroomdata = JSON.parse(chatroomrawdata.toString());
            if(chatroomdata.terminals.includes(`${channelid}`))
                return true;
            return false;
        }
        return false;
    }
    return false;
}

//isUser
//returns whether a discord user is a user in a given chatroom
//returns true if yes, false if no or the chatroom doesn't exist
var isUser = function(chatroom, userid){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/users.json`))
        {
            var userrawdata = fs.readFileSync(`./chatrooms/${chatroom}/users.json`);
            var userdata = JSON.parse(userrawdata.toString());
            if(userdata[`${userid}`])
                return true;
            return false;
        }
        return false;
    }
    return false;
}

//isRegisteredUser
//returns whether a user is registered in a given chatroom to speak
//returns true if yes, false if no or the chatroom doesn't exist
var isRegisteredUser = function(chatroom, userid){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/users.json`))
        {
            var userrawdata = fs.readFileSync(`./chatrooms/${chatroom}/users.json`);
            var userdata = JSON.parse(userrawdata.toString());
            if(userdata[`${userid}`])
            {
                if(userdata[`${userid}`].registered == "Y")
                    return true;
                return false;
            }
            return false;
        }
        return false;
    }
    return false;
}

//username
//retrieves the username for a given user id in a given chatroom
//returns a string that is the username
var username = function(chatroom, userid){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/users.json`))
        {
            var userrawdata = fs.readFileSync(`./chatrooms/${chatroom}/users.json`);
            var userdata = JSON.parse(userrawdata.toString());
            if(userdata[`${userid}`])
            {
                return userdata[`${userid}`].username;
            }
            return err.INVALID_USER_ID;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//profilePicture
//retrieves the profile picture for a given user id in a given chatroom
//returns a string containing the link to the profile picture
var profilePicture = function(chatroom, userid){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/users.json`))
        {
            var userrawdata = fs.readFileSync(`./chatrooms/${chatroom}/users.json`);
            var userdata = JSON.parse(userrawdata.toString());
            if(userdata[`${userid}`])
            {
                return userdata[`${userid}`].profilepic;
            }
            return err.INVALID_USER_ID;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//retrieveAllChatroomIds
//retrieves the ids for all chatrooms this bot has access to
//returns them in an array of strings
var retrieveAllChatroomIds = function(){
    return fs.readdirSync(`./chatrooms`);
}

//retrieveOwner
//retrieves the owner for a chatroom
//returns a single user id
var retrieveOwner = function(chatroom){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/chatroom.json`))
        {
            var chatroomrawdata = fs.readFileSync(`./chatrooms/${chatroom}/chatroom.json`);
            var chatroomdata = JSON.parse(chatroomrawdata.toString());
            return chatroomdata.owner;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//retrieveAdmins
//retrieves all the admins for a chatroom
//returns an array with all the user ids contained
var retrieveAdmins = function(chatroom){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/chatroom.json`))
        {
            var chatroomrawdata = fs.readFileSync(`./chatrooms/${chatroom}/chatroom.json`);
            var chatroomdata = JSON.parse(chatroomrawdata.toString());
            return chatroomdata.admins;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//retrieveTerminals
//retrieves all the terminals for a chatroom
//returns an array with all the channel ids contained
var retrieveTerminals = function(chatroom){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/chatroom.json`))
        {
            var chatroomrawdata = fs.readFileSync(`./chatrooms/${chatroom}/chatroom.json`);
            var chatroomdata = JSON.parse(chatroomrawdata.toString());
            return chatroomdata.terminals;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//retrieveUsers
//retrieves all the users for a chatroom, along with their information
//returns a JSON object with the user ids as keys and the JSON object containing other information as the values
var retrieveUsers = function(chatroom){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/users.json`))
        {
            var userrawdata = fs.readFileSync(`./chatrooms/${chatroom}/users.json`);
            var userdata = JSON.parse(userrawdata.toString());
            return userdata;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//retrieveOwnerMapping
//retrieves owner mappings, all the owners' discord user ids as well as what chatrooms they own
//returns a JSON object with the owner ids as keys and an array containing the chatroom ids as values
var retrieveOwnerMapping = function(){
    try{
        var ownermappingraw = fs.readFileSync(`./chatroommapping/ownermapping.json`);
        var ownermapping = JSON.parse(ownermappingraw.toString());
        return ownermapping;
    }
    catch(error)
    {
        console.log(error);
        return err.FILE_READ_ERROR;
    }
}

//retrieveAdminMapping
//retrieves admin mappings, all the admins' discord user ids as well as what chatrooms they admin for
//returns a JSON object with the owner ids as keys and an array containing the chatroom ids as values
var retrieveAdminMapping = function(){
    try{
        var adminmappingraw = fs.readFileSync(`./chatroommapping/adminmapping.json`);
        var adminmapping = JSON.parse(adminmappingraw.toString());
        return adminmapping;
    }
    catch(error)
    {
        console.log(error);
        return err.FILE_READ_ERROR;
    }
}

//retrieveTerminalMapping
//retrieves terminal mappings, all the channels' discord ids as well as what chatrooms they are a terminal in
//returns a JSON object with the channel ids as keys and an array containing the chatroom ids as values
var retrieveTerminalMapping = function(){
    try{
        var terminalmappingraw = fs.readFileSync(`./chatroommapping/channelmapping.json`);
        var terminalmapping = JSON.parse(terminalmappingraw.toString());
        return terminalmapping;
    }
    catch(error)
    {
        console.log(error);
        return err.FILE_READ_ERROR;
    }
}

//retrieveUserMapping
//retrieves user mappings, all the users' discord ids as well as what chatrooms they are a user in
//returns a JSON object with the user ids as keys and an array containing the chatroom ids as values
var retrieveUserMapping = function(){
    try{
        var usermappingraw = fs.readFileSync(`./chatroommapping/usermapping.json`);
        var usermapping = JSON.parse(usermappingraw.toString());
        return usermapping;
    }
    catch(error)
    {
        console.log(error);
        return err.FILE_READ_ERROR;
    }
}

//retrieveLog
//retrieves the log for a chatroom
//returns an array with all the individual messages/events contained
var retrieveLog = function(chatroom){
    if(fs.existsSync(`./chatrooms/${chatroom}`))
    {
        if(fs.existsSync(`./chatrooms/${chatroom}/log.txt`))
        {
            var lograwdata = fs.readFileSync(`./chatrooms/${chatroom}/log.txt`);
            var logdata = lograwdata.toString().split("\n");
            logdata.pop();
            return logdata;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

module.exports = {
    ownerOf: ownerOf,
    adminFor: adminFor,
    terminalIn: terminalIn,
    userIn: userIn,
    isOwner: isOwner,
    isAdmin: isAdmin,
    isTerminal: isTerminal,
    isUser: isUser,
    isRegisteredUser: isRegisteredUser,
    username: username,
    profilePicture: profilePicture,
    retrieveAllChatroomIds:retrieveAllChatroomIds,
    retrieveOwner: retrieveOwner,
    retrieveAdmins: retrieveAdmins,
    retrieveUsers: retrieveUsers,
    retrieveTerminals: retrieveTerminals,
    retrieveOwnerMapping: retrieveOwnerMapping,
    retrieveAdminMapping: retrieveAdminMapping,
    retrieveTerminalMapping: retrieveTerminalMapping,
    retrieveUserMapping: retrieveUserMapping,
    retrieveLog: retrieveLog
}