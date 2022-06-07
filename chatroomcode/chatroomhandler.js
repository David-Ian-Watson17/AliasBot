const client = require('../client.js').client();
const dhandler = require('./datahandler.js');
const msghandler = require('./messagehandler.js');

//starts the chatroom datahandler and sets up a message listener for the message handler
//also passes the list of chatroom commands to a commandlist passed in, but does not actually
//establish the slash commands itself
var runChatroomHandler = function(){
    dhandler.loadChatrooms();
    dhandler.loadChannelMapping();
    dhandler.loadNameToIdMapping();
    dhandler.loadIdToNameMapping();
    client.on('messageCreate', msg => {
        msghandler.checkMessage(msg);
    });
}

module.exports = {
    runChatroomHandler: runChatroomHandler
}