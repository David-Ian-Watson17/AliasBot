/*
DATAHANDLER

This code handles all interactions between the files and the main code, ensuring data is stored and
retrieved properly. Implements security checks to make sure unauthorized users are not able to modify
data inaccessible to them. It also loads data into a data structure to be easily accessible on being 
needed.

It interacts with the two file handling code modules:
filereading.js
filewriting.js

Data Storage Variables
----------------------
ChatroomData
ChannelMapping
UserMapping

ChatroomData is designed to contain all the chatroom information for every chatroom except the logs.
This is so it can easily access all information about active terminals, admins, and owners at the drop
of a hat, far more efficiently than if it had to go to the files each time.

ChannelMapping is designed to give a quick and dirty way of telling whether a channel is a terminal
in any chatroom, and which chatrooms it is a part of. Ever message sent in a channel the bot has
access to must run through these commands, and determining at a glance if the bot needs to pay attention
to them is a must.

UserMapping echoes the purpose of ChannelMapping. It is a secondary check method to see if a user
sending a message in a terminal has the ability to transmit messages.

Functions List
--------------
------------- Data Loading
loadChatrooms
loadIndividualChatroom
unloadIndividualChatroom
loadChannelMapping
------------- Information Retrieval
retrieveOwner
retrieveAdmins
retrieveUsers
retrieveTerminals
retrieveLog
retrieveUserMapping
retrieveOwnerMapping
retrieveAdminMapping
------------- Message Handling
checkTerminalLegitimacy
retrieveChatroomForTerminal
checkAuthorLegitimacy
retrieveUserData
------------- Verification
isName
isTerminal
isUser
isRegisteredUser
isAdmin
isOwner
------------- Data Updating
createChatroom
deleteChatroom
changeOwner
addAdmin
addTerminal
addUser
removeAdmin
removeTerminal
removeUser
register
updateUsername
updateProfilePicture
logEvent
*/
const fw = require('./filewriting.js');
const fr = require('./filereading.js');
const err = require('../returncodes.json');
const verif = require('./verification.js');

var ChatroomData;
var ChannelMapping;
var NameToIdMapping;
var IdToNameMapping;

var getChatroomData = function(){
    return ChatroomData;
}

var getChannelMapping = function(){
    return ChannelMapping;
}

var getNameToIdMapping = function(){
    return NameToIdMapping;
}

var getIdToNameMapping = function(){
    return IdToNameMapping;
}


//------------------------------------------------------------- Data Loading

//loadChatrooms
//Loads chatroom data for every chatroom in the files into the ChatroomData JSON Object
var loadChatrooms = function(){
    //reset ChatroomData
    ChatroomData = {};

    //retrieve chatroom id list
    var chatroomlist = fr.retrieveAllChatroomIds();

    //load each chatroom
    chatroomlist.forEach(chatroomid => {

        //retrieve owner, admins, terminals, and users
        var chatroomowner = fr.retrieveOwner(chatroomid);
        var chatroomadmins = fr.retrieveAdmins(chatroomid);
        var chatroomterminals = fr.retrieveTerminals(chatroomid);
        var chatroomusers = fr.retrieveUsers(chatroomid);

        //check for file corruption
        var nocorruption = true;
        var ownersuccess, adminssuccess, terminalssuccess, userssuccess = "Loaded Successfully";
        if(chatroomowner == err.CHATROOM_DOESNT_EXIST || chatroomowner == err.FILE_DOESNT_EXIST){
            nocorruption = false;
            ownersuccess = "Loading FAILED!";}
        if(chatroomadmins == err.CHATROOM_DOESNT_EXIST || chatroomadmins == err.FILE_DOESNT_EXIST){
            nocorruption = false;
            adminssuccess = "Loading FAILED!";}
        if(chatroomterminals == err.CHATROOM_DOESNT_EXIST || chatroomadmins == err.FILE_DOESNT_EXIST){
            nocorruption = false;
            terminalssuccess = "Loading FAILED!";}
        if(chatroomusers == err.CHATROOM_DOESNT_EXIST || chatroomusers == err.FILE_DOESNT_EXIST){
            nocorruption = false;
            userssuccess = "Loading FAILED!";}

        //assign a chatroom its slot and fill its data
        if(nocorruption){
            ChatroomData[`${chatroomid}`] = {};
            ChatroomData[`${chatroomid}`].owner = chatroomowner;
            ChatroomData[`${chatroomid}`].admins = chatroomadmins;
            ChatroomData[`${chatroomid}`].terminals = chatroomterminals;
            ChatroomData[`${chatroomid}`].users = chatroomusers;
            console.log(`chatroom ${chatroomid}: Successfully Loaded!`);
        }
        else{
            console.log(`Chatroom ${chatroomid}: Loading FAILED!\n
            Owner: ${ownersuccess}\n
            Admins: ${adminssuccess}\n
            Terminals: ${terminalssuccess}\n
            Users: ${userssuccess}`);
        }
    });
}

//loadIndividualChatroom
//loads all the data for a single chatroom into the ChatroomData
var loadIndividualChatroom = function(chatroomid){
    try{
        //retrieve owner, admins, terminals, and users
        var chatroomowner = fr.retrieveOwner(chatroomid);
        var chatroomadmins = fr.retrieveAdmins(chatroomid);
        var chatroomterminals = fr.retrieveTerminals(chatroomid);
        var chatroomusers = fr.retrieveUsers(chatroomid);

        //check for file corruption
        var nocorruption = true;
        var ownersuccess, adminssuccess, terminalssuccess, userssuccess = "Loaded Successfully";
        if(chatroomowner == err.CHATROOM_DOESNT_EXIST || chatroomowner == err.FILE_DOESNT_EXIST){
            nocorruption = false;
            ownersuccess = "Loading FAILED!";}
        if(chatroomadmins == err.CHATROOM_DOESNT_EXIST || chatroomadmins == err.FILE_DOESNT_EXIST){
            nocorruption = false;
            adminssuccess = "Loading FAILED!";}
        if(chatroomterminals == err.CHATROOM_DOESNT_EXIST || chatroomadmins == err.FILE_DOESNT_EXIST){
            nocorruption = false;
            terminalssuccess = "Loading FAILED!";}
        if(chatroomusers == err.CHATROOM_DOESNT_EXIST || chatroomusers == err.FILE_DOESNT_EXIST){
            nocorruption = false;
            userssuccess = "Loading FAILED!";}

        //assign a chatroom its slot and fill its data
        if(nocorruption){
            ChatroomData[`${chatroomid}`] = {};
            ChatroomData[`${chatroomid}`].owner = chatroomowner;
            ChatroomData[`${chatroomid}`].admins = chatroomadmins;
            ChatroomData[`${chatroomid}`].terminals = chatroomterminals;
            ChatroomData[`${chatroomid}`].users = chatroomusers;
            console.log(`chatroom ${chatroomid}: Successfully Loaded!`);
        }
        else{
            console.log(`Chatroom ${chatroomid}: Loading FAILED!\n
            Owner: ${ownersuccess}\n
            Admins: ${adminssuccess}\n
            Terminals: ${terminalssuccess}\n
            Users: ${userssuccess}`);
        }
    }catch(error){
        console.log(error);
    }
}

//unloadIndividualChatroom
//unloads all the data for a single chatroom from the ChatroomData
var unloadIndividualChatroom = function(chatroomid){
    try{
        delete ChatroomData[`${chatroomid}`];
    }catch(error){
        console.log(error);
    }
}

//loadChannelMapping
//loads channel mapping for all channels the bot has access to that are a terminal in a chatroom
var loadChannelMapping = function(){
    ChannelMapping = fr.retrieveTerminalMapping();
    if(ChannelMapping == err.FILE_READ_ERROR)
        console.log(`CRITICAL ERROR! Channel Mapping failed to load!`);
}

var loadNameToIdMapping = function(){
    NameToIdMapping = fr.retrieveNameToIdMapping();
    if(NameToIdMapping == err.FILE_READ_ERROR)
        console.log(`CRITICAL ERROR! Name to Id Mapping failed to load!`);
}

var loadIdToNameMapping = function(){
    IdToNameMapping = fr.retrieveIdToNameMapping();
    if(IdToNameMapping == err.FILE_READ_ERROR)
        console.log(`CRITICAL ERROR! Id to Name Mapping failed to load!`);
}

//------------------------------------------------------------- Information Retrieval

//retrieveOwner
//returns the owner of a chatroom, or a chatroom doesn't exist error
var retrieveOwner = function(chatroomid){
    try{
        var ownerid = ChatroomData[`${chatroomid}`].owner;
        return ownerid;
    }catch(error){
        return err.CHATROOM_DOESNT_EXIST;
    }
}

//retrieveAdmins
//returns the admins of a chatroom, or a chatroom doesn't exist error
var retrieveAdmins = function(chatroomid){
    try{
        var adminids = ChatroomData[`${chatroomid}`].admins;
        return adminids;
    }catch(error){
        return err.CHATROOM_DOESNT_EXIST;
    }
}

//retrieveTerminals
//returns the terminals of a chatroom, or a chatroom doesn't exist error
var retrieveTerminals = function(chatroomid){
    try{
        var terminalids = ChatroomData[`${chatroomid}`].terminals;
        return terminalids;
    }catch(error){
        return err.CHATROOM_DOESNT_EXIST;
    }
}

//retrieveUsers
//returns the users of a chatroom, or a chatroom doesn't exist error
var retrieveUsers = function(chatroomid){
    try{
        var userids = ChatroomData[`${chatroomid}`].users;
        return userids;
    }catch(error){
        return err.CHATROOM_DOESNT_EXIST;
    }
}

//retrieveLog
//returns the log for a chatroom, or either a chatroom doesn't exist error or a file doesn't exist error
var retrieveLog = function(chatroomid){
    return fr.retrieveLog(chatroomid);
}

//retrieveOwnerMapping
//returns the list of chatrooms a given user id is an owner for, if any
var retrieveOwnerMapping = function(user){
    var ownermapping = fr.retrieveOwnerMapping();
    if(ownermapping[`${user}`])
        return ownermapping[`${user}`];
    return [];
}

//retrieveAdminMapping
//returns the list of chatrooms a given user id is an admin for, if any
var retrieveAdminMapping = function(user){
    var adminmapping = fr.retrieveAdminMapping();
    if(adminmapping[`${user}`])
        return adminmapping[`${user}`];
    return [];
}

//retrieveUserMapping
//returns the list of games a given user id is a user in, if any
var retrieveUserMapping = function(user){
    var usermapping = fr.retrieveUserMapping();
    if(usermapping[`${user}`])
        return usermapping[`${user}`];
    return [];
}

//retrieveName
//retrieves the name that is mapped to a given id
//returns the name if it exists, or an invalid value error if it doesn't
var retrieveName = function(id){
    if(IdToNameMapping[`${id}`])
        return IdToNameMapping[`${id}`];
    return err.INVALID_VALUE;
}

//retrieveId
//retrieves the id that is mapped to a given name
//returns the id if it exists, or an invalid value error if it doesn't
var retrieveId = function(name){
    if(NameToIdMapping[`${name}`])
        return NameToIdMapping[`${name}`];
    return err.INVALID_VALUE;
}

//------------------------------------------------------------- Message Handling

//checkTerminalLegitimacy
//does a quick check to see if a channel is a terminal 
//returns true if it is or false if it isn't
var checkTerminalLegitimacy = function(sentchannelid){
    try{
        if(ChannelMapping[`${sentchannelid}`]) return true;
    }catch(error){return false;}
    return false;
}

//retrieveChatroomForTerminal
//retrieves the chatroom that belongs to a terminal
//returns the chatroom id if it exists or an invalid channel id if it doesn't
var retrieveChatroomForTerminal = function(channelid){
    try{
        if(ChannelMapping[`${channelid}`])
            return ChannelMapping[`${channelid}`];
    }catch(error){
        console.log(error);
        return err.ERROR_UNKNOWN;
    }
    return err.INVALID_CHANNEL_ID;
}

//checkAuthorLegitimacy
//checks to see what the author's current status is in relation to a chatroom
//returns true if the author is a registered user
//otherwise returns one of: Chatroom Doesn't Exist, Invalid User Id, User not Registered, Error Unknown
var checkAuthorLegitimacy = function(chatroomid, authorid)
{
    try{
        //make sure chatroom exists
        if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;

        //check if user is in chatroom
        if(!isUser(chatroomid, authorid)) return err.INVALID_USER_ID;

        //check if user is registered
        if(!isRegisteredUser(chatroomid, authorid)) return err.USER_NOT_REGISTERED;

        //registered user in chatroom!
        return true;
    }catch(error){
        console.log(error)
        return err.ERROR_UNKNOWN;
    }
}

//retrieveUserData
//retrieves the user data associated with a user for a given chatroom
//returns the user data if successful, or a Chatroom Doesn't Exist, Invalid User Id, or 
//Error Unknown error if failed
var retrieveUserData = function(chatroomid, authorid){
    try{
        //ensure chatroom is legitimate
        if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;

        //ensure user is legitimate
        if(!isUser(chatroomid, authorid)) return err.INVALID_USER_ID;

        //return the data associated with the user
        return ChatroomData[`${chatroomid}`].users[`${authorid}`];
    }catch(error){
        console.log(error);
        return err.ERROR_UNKNOWN;
    }
}

//------------------------------------------------------------- Verification

//isName
//returns if a given name is a loaded chatroom name or not
//returns true if it is, false otherwise
var isName = function(name){
    if(NameToIdMapping[`${name}`]) return true;
    return false;
}

//isChatroom
//returns if a given id is a loaded chatroom id or not
//returns true if it is, false otherwise
var isChatroom = function(chatroomid){
    if(ChatroomData[`${chatroomid}`]) return true;
    return false;
}

//isTerminal
//returns if a given channel is a terminal in a given chatroom or not
//returns true if the chatroom exists and it is a terminal in it, false otherwise
var isTerminal = function(chatroomid, channelid){
    try{
        if(ChatroomData[`${chatroomid}`].terminals.includes(`${channelid}`)) return true;
        return false;
    }catch(error){
        return false;
    }
}

//isOwner
//returns if a given discord user is the owner for a given chatroom or not
//returns true if the chatroom exists and the user is its owner, false otherwise
var isOwner = function(chatroomid, ownerid){
    try{
        if(ChatroomData[`${chatroomid}`].owner == `${ownerid}`) return true;
        return false;
    }catch(error){
        return false;
    }
}

//isAdmin
//returns if a given discord user is an admin for a given chatroom or not
//returns true if the chatroom exists and the user is an admin, false otherwise
var isAdmin = function(chatroomid, adminid){
    try{
        if(ChatroomData[`${chatroomid}`].admins.includes(`${adminid}`)) return true;
        return false;
    }catch(error){
        return false;
    }
}

//isUser
//returns if a given discord user is a user in a given chatroom or not
//returns true if the chatroom exists and the user is a user, false otherwise
var isUser = function(chatroomid, userid){
    try{
        if(ChatroomData[`${chatroomid}`].users[`${userid}`]) return true;
        return false;
    }catch(error){
        return false;
    }
}

//isRegisteredUser
//returns if a given discord user is a registered user in a given chatroom or not
//returns true if the chatroom exists, the user is a user, and the user is registered, false otherwise
var isRegisteredUser = function(chatroomid, userid){
    try{
        if(ChatroomData[`${chatroomid}`].users[`${userid}`].registered == "Y") return true;
        return false;
    }catch(error){
        return false;
    }
}

//------------------------------------------------------------- Data Updating

//createChatroom
//performs the necessary steps to create a chatroom and add the owner and admin mapping for its owner
//reloads the chatroom data when finished
//returns good execute on success, or the error if there's an error creating the files
var createChatroom = function(ownerid, name){
    if(!verif.validUser(ownerid)) return err.INVALID_OWNER_ID;
    var newchatroomid = fw.randomIdGenerator();

    //try to create chatroom files
    var creationreturnvalue = fw.createChatroomFiles(newchatroomid, ownerid);
    if(creationreturnvalue != err.GOOD_EXECUTE) return creationreturnvalue;

    //add mapping
    fw.addOwnerMapping(ownerid, newchatroomid);
    fw.addAdminMapping(ownerid, newchatroomid);
    fw.addNameToIdMapping(name, newchatroomid);
    fw.addIdToNameMapping(newchatroomid, name);

    //reload chatroom data
    loadIndividualChatroom(newchatroomid);
    loadNameToIdMapping();
    loadIdToNameMapping();

    return err.GOOD_EXECUTE;
}

//deleteChatroom
//performs the necessary steps to delete a chatroom's files and remove the mapping
//does nothing if the owner id submitted is not the id of the owner
//reloads chatroom and channel mapping data on completion
var deleteChatroom = function(chatroomid, ownerid){
    //verify the sender has necessary privileges
    if(!isOwner(chatroomid, ownerid)) return err.INVALID_OWNER_ID;

    //retrieve chatroom owner, admins, users, and terminals
    var owner = retrieveOwner(chatroomid);
    var admins = retrieveAdmins(chatroomid);
    var users = retrieveUsers(chatroomid);
    var terminals = retrieveTerminals(chatroomid);
    var name = IdToNameMapping[`${id}`];

    //delete all map references
    fw.removeOwnerMapping(owner, chatroomid);
    admins.forEach(admin => {
        fw.removeAdminMapping(admin, chatroomid);
    });
    for (var user in users) {
        fw.removeUserMapping(user, chatroomid);
    }
    terminals.forEach(terminal => {
        fw.removeChannelMapping(terminal);
    })
    fw.removeIdToNameMapping(chatroomid);
    fw.removeNameToIdMapping(chatroomid);

    //delete chatroom files
    fw.deleteChatroomFiles(chatroomid);

    //reload ChatroomData
    unloadIndividualChatroom(chatroomid);
    loadChannelMapping();
    loadNameToIdMapping();
    loadIdToNameMapping();

    return err.GOOD_EXECUTE;
}

//changeOwner
//checks to see if the request is legitimate, then changes the owner of a chatroom
var changeOwner = function(chatroomid, requesterid, newownerid){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isOwner(chatroomid, requesterid)) return err.INVALID_OWNER_ID;
    if(!verif.validUser(newownerid)) return err.INVALID_VALUE;
    //retrieve old owner id
    var oldownerid = fw.retrieveOwner(chatroomid);
    //change owner
    var returncodechatroom = fw.changeOwner(chatroomid, newownerid);
    var returncodemapping = fw.removeOwnerMapping(oldownerid, chatroomid);
    var returncodemapping2 = fw.addOwnerMapping(newownerid, chatroomid);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    //return code
    if(returncodechatroom != err.GOOD_EXECUTE) return err.CHATROOM_REMOVAL_ERROR;
    if(returncodemapping != err.GOOD_EXECUTE) return err.MAP_REMOVAL_ERROR;
    if(returncodemapping2 != err.GOOD_EXECUTE) return err.MAP_ADDING_ERROR;
    return err.GOOD_EXECUTE;
}

//addAdmin
//checks to see if the request is legitimate, then adds a new admin to a chatroom
var addAdmin = function(chatroomid, requesterid, newadminid){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isOwner(chatroomid, requesterid)) return err.INVALID_OWNER_ID;
    if(!verif.validUser(newadminid)) return err.INVALID_VALUE;
    //add admin
    var returncodechatroom = fw.addAdmin(chatroomid, newadminid);
    var returncodemapping = fw.addAdminMapping(newadminid, chatroomid);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    //return code
    if(returncodechatroom != err.GOOD_EXECUTE) return err.CHATROOM_REMOVAL_ERROR;
    if(returncodemapping != err.GOOD_EXECUTE) return err.MAP_ADDING_ERROR;
    return err.GOOD_EXECUTE;
}

//removeAdmin
//checks to see if the request is legitimate, then removes an admin from a chatroom
var removeAdmin = function(chatroomid, requesterid, adminid){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isOwner(chatroomid, requesterid)) return err.INVALID_OWNER_ID;
    if(isOwner(chatroomid, adminid)) return err.INVALID_VALUE;
    //remove admin
    var returncodechatroom = fw.removeAdmin(chatroomid, adminid);
    var returncodemapping = fw.removeAdminMapping(adminid, chatroomid);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    //return code
    if(returncodechatroom != err.GOOD_EXECUTE) return err.CHATROOM_REMOVAL_ERROR;
    if(returncodemapping != err.GOOD_EXECUTE) return err.MAP_REMOVAL_ERROR;
    return err.GOOD_EXECUTE;
}

//addTerminal
//Checks to see if the request is legitimate, then adds a channel to a chatroom
var addTerminal = function(chatroomid, requesterid, channelid){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isAdmin(chatroomid, requesterid)) return err.INVALID_ADMIN_ID;
    if(!verif.validChannel(channelid)) return err.INVALID_VALUE;
    //add terminal
    var returncodechatroom = fw.addChannel(chatroomid, channelid);
    var returncodemapping = fw.addChannelMapping(channelid, chatroomid);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    loadChannelMapping();
    //return code
    if(returncodechatroom != err.GOOD_EXECUTE) return err.CHATROOM_REMOVAL_ERROR;
    if(returncodemapping != err.GOOD_EXECUTE) return err.MAP_ADDING_ERROR;
    return err.GOOD_EXECUTE;
}

//removeTerminal
//Checks to see if the request is legitimate, then removes a channel from a chatroom
var removeTerminal = function(chatroomid, requesterid, channelid){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isAdmin(chatroomid, requesterid)) return err.INVALID_ADMIN_ID;
    //remove terminal
    var returncodechatroom = fw.removeChannel(chatroomid, channelid);
    //remove terminal mapping
    var returncodemapping = fw.removeChannelMapping(channelid);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    loadChannelMapping();
    //return code
    if(returncodechatroom != err.GOOD_EXECUTE) return err.CHATROOM_REMOVAL_ERROR;
    if(returncodemapping != err.GOOD_EXECUTE) return err.MAP_REMOVAL_ERROR;
    return err.GOOD_EXECUTE;
}

//addUser
//Checks to see if the request is legitimate, then adds a user to a chatroom
var addUser = function(chatroomid, requesterid, userid){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isAdmin(chatroomid, requesterid)) return err.INVALID_ADMIN_ID;
    if(!verif.validUser(userid)) return err.INVALID_VALUE;
    //add user
    var returncodechatroom = fw.addUser(chatroomid, userid);
    var returncodemapping = fw.addUserMapping(userid, chatroomid);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    //return code
    if(returncodechatroom != err.GOOD_EXECUTE) return err.CHATROOM_REMOVAL_ERROR;
    if(returncodemapping != err.GOOD_EXECUTE) return err.MAP_ADDING_ERROR;
    return err.GOOD_EXECUTE;
}

//removeUser
//Checks to see if the request is legitimate, then remove a user from a chatroom
var removeUser = function(chatroomid, requesterid, userid){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isAdmin(chatroomid, requesterid)) return err.INVALID_ADMIN_ID;
    //remove user
    var returncodechatroom = fw.removeUser(chatroomid, userid);
    var returncodemapping = fw.removeUserMapping(userid, chatroomid);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    //return code
    if(returncodechatroom != err.GOOD_EXECUTE) return err.CHATROOM_REMOVAL_ERROR;
    if(returncodemapping != err.GOOD_EXECUTE) return err.MAP_REMOVAL_ERROR;
    return err.GOOD_EXECUTE;
}

//register
//Registers a user as ready to send messages in a chatroom
var register = function(chatroomid, userid){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isUser(chatroomid, userid)) return err.INVALID_USER_ID;
    //register
    var returncode = fw.changeRegistration(chatroomid, userid, "Y");
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    //return code
    return returncode;
}

//updateUsername
//Updates a user's username
var updateUsername = function(chatroomid, userid, newusername){
    //verify
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isUser(chatroomid, userid)) return err.INVALID_USER_ID;
    var usernameverif = verif.validUsername(newusername);
    if(!(usernameverif == true)) return usernameverif;
    //change username
    var returncode = fw.changeUsername(chatroomid, userid, newusername);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    //return code
    return returncode;
}

//updateProfilePicture
var updateProfilePicture = function(chatroomid, userid, newprofilepicturelink){
    if(!isChatroom(chatroomid)) return err.CHATROOM_DOESNT_EXIST;
    if(!isUser(chatroomid, userid)) return err.INVALID_USER_ID;
    var profilepicverif = verif.validProfilePicture(newprofilepicturelink)
    if(!(profilepicverif == true)) return profilepicverif;
    //change profile picture
    var returncode = fw.changeProfilePicture(chatroomid, userid, newprofilepicturelink);
    //reload chatroom data
    loadIndividualChatroom(chatroomid);
    //return code
    return returncode;
}

var logEvent = function(chatroom, userid, type, content, attachments){
    return fw.logEvent(chatroom, userid, type, content, attachments);
}

var parseLog = function(logarray){
    
}

module.exports = {
    getChatroomData: getChatroomData,
    getChannelMapping: getChannelMapping,
    getNameToIdMapping: getNameToIdMapping,
    getIdToNameMapping: getIdToNameMapping,
    loadChatrooms: loadChatrooms,
    loadIndividualChatroom: loadIndividualChatroom,
    unloadIndividualChatroom: unloadIndividualChatroom,
    loadChannelMapping: loadChannelMapping,
    loadNameToIdMapping: loadNameToIdMapping,
    loadIdToNameMapping: loadIdToNameMapping,
    retrieveOwner: retrieveOwner,
    retrieveAdmins: retrieveAdmins,
    retrieveUsers: retrieveUsers,
    retrieveTerminals: retrieveTerminals,
    retrieveLog: retrieveLog,
    retrieveUserMapping: retrieveUserMapping,
    retrieveOwnerMapping: retrieveOwnerMapping,
    retrieveAdminMapping: retrieveAdminMapping,
    retrieveName: retrieveName,
    retrieveId: retrieveId,
    checkTerminalLegitimacy: checkTerminalLegitimacy,
    retrieveChatroomForTerminal: retrieveChatroomForTerminal,
    checkAuthorLegitimacy: checkAuthorLegitimacy,
    retrieveUserData: retrieveUserData,
    isName: isName,
    isChatroom: isChatroom,
    isTerminal: isTerminal,
    isOwner: isOwner,
    isAdmin: isAdmin,
    isUser: isUser,
    isRegisteredUser: isRegisteredUser,
    createChatroom: createChatroom,
    deleteChatroom: deleteChatroom,
    changeOwner: changeOwner,
    addAdmin: addAdmin,
    removeAdmin: removeAdmin,
    addTerminal: addTerminal,
    removeTerminal: removeTerminal,
    addUser: addUser,
    removeUser: removeUser,
    register: register,
    updateUsername: updateUsername,
    updateProfilePicture: updateProfilePicture,
    logEvent: logEvent
}

/*
Functions List
--------------
------------- Data Loading
loadChatrooms
loadIndividualChatroom
unloadIndividualChatroom
loadChannelMapping
------------- Information Retrieval
retrieveOwner
retrieveAdmins
retrieveUsers
retrieveTerminals
retrieveLog
------------- Message Handling
checkTerminalLegitimacy
retrieveChatroomForTerminal
checkAuthorLegitimacy
retrieveUserData
------------- Verification
isTerminal
isUser
isRegisteredUser
isAdmin
isOwner
------------- Data Updating
createChatroom
deleteChatroom
changeOwner
addAdmin
addTerminal
addUser
removeAdmin
removeTerminal
removeUser
register
updateUsername
updateProfilePicture
logEvent
*/