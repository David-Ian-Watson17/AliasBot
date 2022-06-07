/*
FILEWRITING

This code page contains all the code necessary to interface with and make changes to 
the various files the chatbot uses.

These files are:

Universal Files
---------------
ownermapping.json
adminmapping.json
usermapping.json
channelmapping.json
nametoidmapping.json
idtonamemapping.json

Chatroom Files
--------------
chatroom.json
users.json
log.txt

List of Functions
-----------------
------------------- ID Generation
randomIdGenerator
------------------- File Creation/Deletion
createChatroomFiles
deleteChatroomFiles
------------------- Universal Mapping
addOwnerMapping
addAdminMapping
addUserMapping
addChannelMapping
addNameToIdMapping
addIdToNameMapping
removeOwnerMapping
removeAdminMapping
removeUserMapping
removeChannelMapping
removeNameToIdMapping
removeIdToNameMapping
------------------- Chatroom.json modifiers
changeOwner
addAdmin
removeAdmin
addChannel
removeChannel
------------------- Users.json modifiers
addUser
removeUser
changeUsername
changeProfilePicture
changeRegistration
------------------- Log.txt modifiers
logEvent
*/

const fs = require('fs');
const err = require('../returncodes.json');
const util = require('./utilities.js');
const verif = require('./verification.js');
const { chatroomPath, mappingPath } = require('./paths.js');

var randomIdGenerator = function(){
    var newid = util.randomNumberGenerator(0, 999999);
    while(fs.existsSync(`${chatroomPath}/${newid}`))
        newid = util.randomNumberGenerator(0, 999999);
    return newid;
}

var createChatroomFiles = function(chatroomid, ownerid)
{
    //verify chatroom doesn't exist
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`))
        return err.VALUE_ALREADY_PRESENT;

    //create chatroom.json and users.json initial objects and stringify
    var chatroominit = {
        "owner": `${ownerid}`,
        "admins": [`${ownerid}`],
        "terminals": []
    };
    var usersinit = {
        
    };
    var chatroominitjson = JSON.stringify(chatroominit);
    var usersinitjson = JSON.stringify(usersinit);

    //create and populate files
    try{
        fs.mkdirSync(`${chatroomPath}/${chatroomid}`);
        fs.writeFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`, chatroominitjson);
        fs.writeFileSync(`${chatroomPath}/${chatroomid}/users.json`, usersinitjson);
        fs.writeFileSync(`${chatroomPath}/${chatroomid}/log.txt`, "");
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var deleteChatroomFiles = function(chatroomid)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`))
    {
        try{
            fs.rmSync(`${chatroomPath}/${chatroomid}`, { recursive: true, force: true });
            return err.GOOD_EXECUTE;
        }
        catch(error){
            console.log(error);
            return err.FAILED_TO_DELETE_DIRECTORY;
        }
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//addOwnerMapping: adds a chatroom to the list of chatrooms a discord user is owner for
var addOwnerMapping = function(ownerid, chatroomid)
{
    //read data from file
    try{
        var ownermaprawdata = fs.readFileSync(`${mappingPath}/ownermapping.json`);
        var ownermapdata = JSON.parse(ownermaprawdata.toString());
    }catch(error){
        console.log(error)
        return err.FILE_READ_ERROR;
    }

    //append new data to owner or create entry for owner
    if(ownermapdata[ownerid])
    {
        if(!ownermapdata[ownerid].includes(`${chatroomid}`))
            ownermapdata[ownerid].push(`${chatroomid}`);
        else
            return err.VALUE_ALREADY_PRESENT;
    }
    else
        ownermapdata[ownerid] = [`${chatroomid}`];

    //write back to file
    try{
        var ownermapnewrawdata = JSON.stringify(ownermapdata);
        fs.writeFileSync(`${mappingPath}/ownermapping.json`, ownermapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

//addAdminMapping: adds a chatroom to the list of chatrooms a discord user is admin for
var addAdminMapping = function(adminid, chatroomid)
{
    //read data from file
    try{
        var adminmaprawdata = fs.readFileSync(`${mappingPath}/adminmapping.json`);
        var adminmapdata = JSON.parse(adminmaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //append new data to admin or create entry for admin
    if(adminmapdata[adminid])
    {
        if(!adminmapdata[adminid].includes(`${chatroomid}`))
            adminmapdata[adminid].push(`${chatroomid}`);
        else
            return err.VALUE_ALREADY_PRESENT;
    }
    else
        adminmapdata[adminid] = [`${chatroomid}`];

    //write back to file
    try{
        var adminmapnewrawdata = JSON.stringify(adminmapdata);
        fs.writeFileSync(`${mappingPath}/adminmapping.json`, adminmapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

//addUserMapping: adds a chatroom to the list of chatrooms a discord user is a user in
var addUserMapping = function(userid, chatroomid)
{
    //read data from file
    try{
        var usermaprawdata = fs.readFileSync(`${mappingPath}/usermapping.json`);
        var usermapdata = JSON.parse(usermaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //append new data to user or create entry for user
    if(usermapdata[userid])
    {
        if(!usermapdata[userid].includes(`${chatroomid}`))
            usermapdata[userid].push(`${chatroomid}`);
        else
            return err.VALUE_ALREADY_PRESENT;
    }
    else
        usermapdata[userid] = [`${chatroomid}`];

    //write back to file
    try{
        var usermapnewrawdata = JSON.stringify(usermapdata);
        fs.writeFileSync(`${mappingPath}/usermapping.json`, usermapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

//addChannelMapping: adds a chatroom to the list of chatrooms a channel is terminal for
var addChannelMapping = function(channelid, chatroomid)
{
    //read data from file
    try{
        var channelmaprawdata = fs.readFileSync(`${mappingPath}/channelmapping.json`);
        var channelmapdata = JSON.parse(channelmaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //check if channel already has mapping
    if(channelmapdata[channelid]) return err.VALUE_ALREADY_PRESENT;

    //write mapping
    channelmapdata[channelid] = `${chatroomid}`;

    //write back to file
    try{
        var channelmapnewrawdata = JSON.stringify(channelmapdata);
        fs.writeFileSync(`${mappingPath}/channelmapping.json`, channelmapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var addNameToIdMapping = function(name, id){
    //read data from file
    try{
        var namemaprawdata = fs.readFileSync(`${mappingPath}/nametoidmapping.json`);
        var namemapdata = JSON.parse(namemaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //check if name already has mapping
    if(namemapdata[`${name}`]) return err.VALUE_ALREADY_PRESENT;

    //write mapping
    namemapdata[`${name}`] = `${id}`;

    //write back to file
    try{
        var namemapnewrawdata = JSON.stringify(namemapdata);
        fs.writeFileSync(`${mappingPath}/nametoidmapping.json`, namemapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var addIdToNameMapping = function(id, name){
    //read data from file
    try{
        var namemaprawdata = fs.readFileSync(`${mappingPath}/idtonamemapping.json`);
        var namemapdata = JSON.parse(namemaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //check if name already has mapping
    if(namemapdata[`${id}`]) return err.VALUE_ALREADY_PRESENT;

    //write mapping
    namemapdata[`${id}`] = `${name}`;

    //write back to file
    try{
        var namemapnewrawdata = JSON.stringify(namemapdata);
        fs.writeFileSync(`${mappingPath}/idtonamemapping.json`, namemapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var removeOwnerMapping = function(ownerid, chatroomid)
{
    //read data from file
    try{
        var ownermaprawdata = fs.readFileSync(`${mappingPath}/ownermapping.json`);
        var ownermapdata = JSON.parse(ownermaprawdata.toString());
    }catch(error){
        console.log(error)
        return err.FILE_READ_ERROR;
    }

    //check if owner exists
    if(!ownermapdata[`${ownerid}`])
        return err.INVALID_OWNER_ID;

    //check if chatroom is even in the mapping
    if(!ownermapdata[`${ownerid}`].includes(`${chatroomid}`))
        return err.VALUE_NOT_PRESENT;

    //remove chatroom from mapping
    var index = ownermapdata[`${ownerid}`].indexOf(`${chatroomid}`);
    if(index > -1) {
        ownermapdata[`${ownerid}`].splice(index, 1);
    }

    //if ownermap for that owner no longer contains entries, remove it from the file
    if(ownermapdata[`${ownerid}`].length == 0)
        delete ownermapdata[`${ownerid}`];

    //write back to file
    try{
        var ownermapnewrawdata = JSON.stringify(ownermapdata);
        fs.writeFileSync(`${mappingPath}/ownermapping.json`, ownermapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var removeAdminMapping = function(adminid, chatroomid)
{
    //read data from file
    try{
        var adminmaprawdata = fs.readFileSync(`${mappingPath}/adminmapping.json`);
        var adminmapdata = JSON.parse(adminmaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //check if admin exists
    if(!adminmapdata[`${adminid}`])
        return err.INVALID_ADMIN_ID;

    //check if chatroom is even in the mapping
    if(!adminmapdata[`${adminid}`].includes(`${chatroomid}`))
        return err.VALUE_NOT_PRESENT;

    //remove chatroom from mapping
    var index = adminmapdata[`${adminid}`].indexOf(`${chatroomid}`);
    if(index > -1) {
        adminmapdata[`${adminid}`].splice(index, 1);
    }

    //if adminmap for that admin no longer contains entries, remove it from the file
    if(adminmapdata[`${adminid}`].length == 0)
        delete adminmapdata[`${adminid}`];

    //write back to file
    try{
        var adminmapnewrawdata = JSON.stringify(adminmapdata);
        fs.writeFileSync(`${mappingPath}/adminmapping.json`, adminmapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var removeUserMapping = function(userid, chatroomid)
{
    //read data from file
    try{
        var usermaprawdata = fs.readFileSync(`${mappingPath}/usermapping.json`);
        var usermapdata = JSON.parse(usermaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //check if user exists
    if(!usermapdata[`${userid}`])
        return err.INVALID_USER_ID;

    //check if chatroom is even in the mapping
    if(!usermapdata[`${userid}`].includes(`${chatroomid}`))
        return err.VALUE_NOT_PRESENT;

    //remove chatroom from mapping
    var index = usermapdata[`${userid}`].indexOf(`${chatroomid}`);
    if(index > -1) {
        usermapdata[`${userid}`].splice(index, 1);
    }

    //if usermap for that user no longer contains entries, remove it from the file
    if(usermapdata[`${userid}`].length == 0)
        delete usermapdata[`${userid}`];

    //write back to file
    try{
        var usermapnewrawdata = JSON.stringify(usermapdata);
        fs.writeFileSync(`${mappingPath}/usermapping.json`, usermapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var removeChannelMapping = function(channelid)
{
    //read data from file
    try{
        var channelmaprawdata = fs.readFileSync(`${mappingPath}/channelmapping.json`);
        var channelmapdata = JSON.parse(channelmaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //check if channel exists
    if(!channelmapdata[`${channelid}`])
        return err.INVALID_CHANNEL_ID;

    //delete mapping
    delete channelmapdata[`${channelid}`];

    //write back to file
    try{
        var channelmapnewrawdata = JSON.stringify(channelmapdata);
        fs.writeFileSync(`${mappingPath}/channelmapping.json`, channelmapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var removeNameToIdMapping = function(name){
    //read data from file
    try{
        var namemaprawdata = fs.readFileSync(`${mappingPath}/nametoidmapping.json`);
        var namemapdata = JSON.parse(namemaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //check if channel exists
    if(!namemapdata[`${name}`])
        return err.INVALID_VALUE;

    //delete mapping
    delete channelmapdata[`${name}`];

    //write back to file
    try{
        var namemapnewrawdata = JSON.stringify(namemapdata);
        fs.writeFileSync(`${mappingPath}/nametoidmapping.json`, namemapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var removeIdToNameMapping = function(id){
    //read data from file
    try{
        var namemaprawdata = fs.readFileSync(`${mappingPath}/idtonamemapping.json`);
        var namemapdata = JSON.parse(namemaprawdata.toString());
    }catch(error){
        console.log(error);
        return err.FILE_READ_ERROR;
    }

    //check if channel exists
    if(!namemapdata[`${id}`])
        return err.INVALID_CHANNEL_ID;

    //delete mapping
    delete namemapdata[`${id}`];

    //write back to file
    try{
        var namemapnewrawdata = JSON.stringify(namemapdata);
        fs.writeFileSync(`${mappingPath}/idtonamemapping.json`, namemapnewrawdata);
    }catch(error){
        console.log(error);
        return err.FILE_WRITE_ERROR;
    }

    return err.GOOD_EXECUTE;
}

var changeOwner = function(chatroomid, newownerid)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`))
    {
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/chatroom.json`))
        {
            //read from file
            try{
                var chatroomrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`);
                var chatroomdata = JSON.parse(chatroomrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }

            //check if the owner is already the one sent in
            if(chatroomdata["owner"] == `${newownerid}`)
                return err.VALUE_ALREADY_PRESENT;

            //change owner id
            chatroomdata["owner"] = `${newownerid}`;

            //write back to file
            try{
                var chatroomnewrawdata = JSON.stringify(chatroomdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`, chatroomnewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

var addAdmin = function(chatroomid, adminid)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`))
    {
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/chatroom.json`))
        {
            //read from file
            try{
                var chatroomrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`);
                var chatroomdata = JSON.parse(chatroomrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }

            //add id to admin list if it isn't there
            if(chatroomdata["admins"].includes(`${adminid}`))
                return err.VALUE_ALREADY_PRESENT;
            chatroomdata["admins"].push(`${adminid}`);

            //write back to file
            try{
                var chatroomnewrawdata = JSON.stringify(chatroomdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`, chatroomnewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

var removeAdmin = function(chatroomid, adminid)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`))
    {
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/chatroom.json`))
        {
            //read from file
            try{
                var chatroomrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`);
                var chatroomdata = JSON.parse(chatroomrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }
            
            //delete user from admin list if it's there
            var index = chatroomdata["admins"].indexOf(`${adminid}`);
            if(index == -1) {
                return err.VALUE_NOT_PRESENT;
            }
            chatroomdata["admins"].splice(index, 1);

            //write back to file
            try{
                var chatroomnewrawdata = JSON.stringify(chatroomdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`, chatroomnewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

var addChannel = function(chatroomid, channelid)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`))
    {
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/chatroom.json`))
        {
            //read from file
            try{
                var chatroomrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`);
                var chatroomdata = JSON.parse(chatroomrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }

            //add channel to terminal list if it isn't there
            if(chatroomdata["terminals"].includes(`${channelid}`))
                return err.VALUE_ALREADY_PRESENT;
            chatroomdata["terminals"].push(`${channelid}`);

            //write back to file
            try{
                var chatroomnewrawdata = JSON.stringify(chatroomdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`, chatroomnewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

var removeChannel = function(chatroomid, channelid)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`))
    {
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/chatroom.json`))
        {
            //read from file
            try{
                var chatroomrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`);
                var chatroomdata = JSON.parse(chatroomrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }
            
            //delete channel from terminal list if it's there
            var index = chatroomdata["terminals"].indexOf(`${channelid}`);
            if(index == -1) {
                return err.VALUE_NOT_PRESENT;
            }
            chatroomdata["terminals"].splice(index, 1);

            //write back to file
            try{
                var chatroomnewrawdata = JSON.stringify(chatroomdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/chatroom.json`, chatroomnewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

var addUser = function(chatroomid, userid)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`)){
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/users.json`)){
            //read from file
            try{
                var userrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/users.json`);
                var userdata = JSON.parse(userrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }

            //check for user entry and create new one if not present
            if(userdata[`${userid}`])
                return err.VALUE_ALREADY_PRESENT;

            var newuser = {
                "registered": "N",
                "username": "",
                "profilepic": ""
            };
            userdata[`${userid}`] = newuser;

            //write back to file
            try{
                var usernewrawdata = JSON.stringify(userdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/users.json`, usernewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//removeUser
var removeUser = function(chatroomid, userid)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`)){
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/users.json`)){
            //read from file
            try{
                var userrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/users.json`);
                var userdata = JSON.parse(userrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }

            //check for user entry and remove it if it exists
            if(!userdata[`${userid}`])
                return err.VALUE_NOT_PRESENT;
            delete userdata[`${userid}`];

            //write back to file
            try{
                var usernewrawdata = JSON.stringify(userdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/users.json`, usernewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//changeUsername
var changeUsername = function(chatroomid, userid, newusername)
{
    //verify username is valid
    var usernameverification = verif.validUsername(newusername);
    switch(usernameverification){
        case true:
            break;
        default:
            return usernameverification;
    }

    if(fs.existsSync(`${chatroomPath}/${chatroomid}`)){
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/users.json`)){
            //read from file
            try{
                var userrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/users.json`);
                var userdata = JSON.parse(userrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }

            //check for user entry and modify the username if it exists
            if(!userdata[`${userid}`])
                return err.INVALID_USER_ID;
            userdata[`${userid}`].username = newusername;

            //write back to file
            try{
                var usernewrawdata = JSON.stringify(userdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/users.json`, usernewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//changeProfilePicture
var changeProfilePicture = function(chatroomid, userid, newprofilepicture)
{
    if(fs.existsSync(`${chatroomPath}/${chatroomid}`)){
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/users.json`)){
            //read from file
            try{
                var userrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/users.json`);
                var userdata = JSON.parse(userrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }

            //check for user entry and modify the username if it exists
            if(!userdata[`${userid}`])
                return err.INVALID_USER_ID;
            userdata[`${userid}`].profilepic = newprofilepicture;

            //write back to file
            try{
                var usernewrawdata = JSON.stringify(userdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/users.json`, usernewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//changeRegistration
//modifies the registration status of a given user for a given chatroom
//accepts "Y" or "N" for registrationstatus
var changeRegistration = function(chatroomid, userid, registrationstatus)
{
    //verify valid registration status
    if(registrationstatus != "N" && registrationstatus != "Y")
        return err.INVALID_VALUE;

    if(fs.existsSync(`${chatroomPath}/${chatroomid}`)){
        if(fs.existsSync(`${chatroomPath}/${chatroomid}/users.json`)){
            //read from file
            try{
                var userrawdata = fs.readFileSync(`${chatroomPath}/${chatroomid}/users.json`);
                var userdata = JSON.parse(userrawdata.toString());
            }catch(error){
                console.log(error);
                return err.FILE_READ_ERROR;
            }

            //check for user entry and modify the username if it exists
            if(!userdata[`${userid}`])
                return err.INVALID_USER_ID;
            userdata[`${userid}`].registered = registrationstatus;

            //write back to file
            try{
                var usernewrawdata = JSON.stringify(userdata);
                fs.writeFileSync(`${chatroomPath}/${chatroomid}/users.json`, usernewrawdata);
            }catch(error){
                console.log(error);
                return err.FILE_WRITE_ERROR;
            }
            return err.GOOD_EXECUTE;
        }
        return err.FILE_DOESNT_EXIST;
    }
    return err.CHATROOM_DOESNT_EXIST;
}

//logEvent
//accepts a chatroom id and a log event, with the user id, the type of event, and the contents of the string
//appends them to the end of the log file
var logEvent = function(chatroom, user, type, contents, attachmentlinks){
    /*if(verif.validUser(user))
    {*/
        if(verif.validLogType(type))
        {
            if(fs.existsSync(`${chatroomPath}/${chatroom}`))
            {
                if(fs.existsSync(`${chatroomPath}/${chatroom}/log.txt`))
                {
                    fs.appendFileSync(`${chatroomPath}/${chatroom}/log.txt`, `${user}  ${type}  ${contents}`);
                    if(attachmentlinks.length > 0){
                        fs.appendFileSync(`${chatroomPath}/${chatroom}/log.txt`, " ");
                        attachmentlinks.forEach(link => {
                            fs.appendFileSync(`${chatroomPath}/${chatroom}/log.txt`, ` ${link}`);
                        })
                    }
                    fs.appendFileSync(`${chatroomPath}/${chatroom}/log.txt`, "\n");
                    return err.GOOD_EXECUTE;
                }
                return err.FILE_DOESNT_EXIST;
            }
            return err.CHATROOM_DOESNT_EXIST;
        }
        return err.INVALID_TYPE;
    /*}
    return err.INVALID_USER_ID;*/
}

module.exports = {
    randomIdGenerator: randomIdGenerator,
    createChatroomFiles: createChatroomFiles,
    deleteChatroomFiles: deleteChatroomFiles,
    addOwnerMapping: addOwnerMapping,
    addAdminMapping: addAdminMapping,
    addUserMapping: addUserMapping,
    addChannelMapping: addChannelMapping,
    addNameToIdMapping: addNameToIdMapping,
    addIdToNameMapping: addIdToNameMapping,
    removeOwnerMapping: removeOwnerMapping,
    removeAdminMapping: removeAdminMapping,
    removeUserMapping: removeUserMapping,
    removeChannelMapping: removeChannelMapping,
    removeNameToIdMapping: removeNameToIdMapping,
    removeIdToNameMapping: removeIdToNameMapping,
    changeOwner: changeOwner,
    addAdmin: addAdmin,
    removeAdmin: removeAdmin,
    addChannel: addChannel,
    removeChannel: removeChannel,
    addUser: addUser,
    removeUser: removeUser,
    changeUsername: changeUsername,
    changeProfilePicture: changeProfilePicture,
    changeRegistration: changeRegistration,
    logEvent: logEvent
}

/*
randomIdGenerator
createChatroomFiles
deleteChatroomFiles
addOwnerMapping
addAdminMapping
addUserMapping
addChannelMapping
changeOwner
addAdmin
removeAdmin
addChannel
removeChannel
addUser
removeUser
changeUsername
changeProfilePicture
changeRegistration
*/