/*
VERIFICATION

A module to verify certain values are good. Relies on drawing from the client.

Verification functions
----------------------
validUser
validChannel
validGuild
validUsername

*/

const client = require('../client.js').client();
const err = require('../returncodes.json');

//validUser
//verify a user id belongs to a valid user the client has access to
var validUser = function(userid)
{
    var user = client.users.cache.get(userid);
    switch(user){
        case undefined:
            return false;
        default:
            return true;
    }
}

//validChannel
//verify a channel id belongs to a valid channel the client has access to
var validChannel = function(channelid)
{
    var channel = client.channels.cache.get(channelid);
    switch(channel){
        case undefined:
            return false;
        default:
            return true;
    }
}

//validGuild
//verify a guild id belongs to a valid guild the client has access to
var validGuild = function(guildid)
{
    var guild = client.guilds.cache.get(guildid);
    switch(guild){
        case undefined:
            return false;
        default:
            return true;
    }
}

//validUsername
//verify a username is a string of the appropriate length to be sent through a webhook
var validUsername = function(username)
{
    if(typeof username === 'string')
    {
        if(username.length <= 80)
        {
            if(username.length > 0)
            {
                return true;
            }
            return err.STRING_TOO_SHORT;
        }
        return err.STRING_TOO_LONG;
    }
    return err.INVALID_TYPE;
}
//validLogType
//returns true if the entered value is a valid string to be entered into the log as an event type
var validLogType = function(logtype)
{
    switch(logtype){
        case "PP":
        case "UU":
        case "M":
            return true;
        default:
            return false;
    }
}

module.exports = {
    validUser: validUser,
    validChannel: validChannel,
    validGuild: validGuild,
    validUsername: validUsername,
    validLogType: validLogType
}