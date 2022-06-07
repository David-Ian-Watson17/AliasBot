var dh = require('../chatroomcode/datahandler.js');
var fw = require('../chatroomcode/filewriting.js');
var err = require('../returncodes.json');

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
*/

//equals operator code taken from: https://stackoverflow.com/questions/7837456/how-to-compare-arrays-in-javascript
// Warn if overriding existing method
if(Array.prototype.equals)
    console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");
// attach the .equals method to Array's prototype to call it on any array
Array.prototype.equals = function (array) {
    // if the other array is a falsy value, return
    if (!array)
        return false;

    // compare lengths - can save a lot of time 
    if (this.length != array.length)
        return false;

    for (var i = 0, l=this.length; i < l; i++) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i]))
                return false;       
        }           
        else if (this[i] != array[i]) { 
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;   
        }           
    }       
    return true;
}
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", {enumerable: false});

var retrieveOwnerTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    dh.loadChatrooms();
    
    var return1 = dh.retrieveOwner(111111);
    var return2 = dh.retrieveOwner(222222);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`retrieveOwner Standard: ${return1 == "1111111111111111"}`);
    console.log(`retrieveOwner No Such Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
}

var retrieveAdminsTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addAdmin(111111, 2222222222222222);

    dh.loadChatrooms();

    var return1 = dh.retrieveAdmins(111111);
    var return2 = dh.retrieveAdmins(222222);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`retrieveAdmins Standard: ${return1.equals(["1111111111111111", "2222222222222222"])}`);
    console.log(`retrieveAdmins No Such Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
}

var retrieveUsersTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);

    dh.loadChatrooms();

    var return1 = dh.retrieveUsers(111111);
    var return2 = dh.retrieveUsers(222222);

    dh.deleteChatroom(111111, 1111111111111111);
    console.log(`retrieveUsers Standard: ${JSON.stringify(return1) == JSON.stringify({"2222222222222222":{"registered": "N", "username": "", "profilepic": ""}})}`);
    console.log(`retrieveUsers No Such Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
}

var retrieveTerminalsTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addChannel(111111, 2222222222222222);
    fw.addChannel(111111, 3333333333333333);

    dh.loadChatrooms();

    var return1 = dh.retrieveTerminals(111111);
    var return2 = dh.retrieveTerminals(222222);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`retrieveTerminals Standard: ${return1.equals(["2222222222222222", "3333333333333333"])}`);
    console.log(`retrieveTerminals No Such Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
}

var retrieveLogTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.logEvent(111111, "1111111111111111", "M", "Hello World!");

    dh.loadChatrooms();

    var return1 = dh.retrieveLog(111111);
    var return2 = dh.retrieveLog(222222);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`retrieveLog Standard: ${return1.equals(["1111111111111111  M  Hello World!"])}`);
    console.log(`retrieveLog No Such Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
}

var checkTerminalLegitimacyTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addChannel(111111, 4);
    fw.addChannelMapping(4, 111111);

    dh.loadChannelMapping();
    dh.loadChatrooms();

    var return1 = dh.checkTerminalLegitimacy(4);
    var return2 = dh.checkTerminalLegitimacy(222222222);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`checkTerminalLegitimacy Valid Terminal: ${return1 == true}`);
    console.log(`checkTerminalLegitimacy Invalid Terminal: ${return2 == false}`);
}

var retrieveChatroomForTerminalTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addChannel(111111, 4);
    fw.addChannelMapping(4, 111111);

    dh.loadChatrooms();
    dh.loadChannelMapping();

    var return1 = dh.retrieveChatroomForTerminal("4");
    var return2 = dh.retrieveChatroomForTerminal("3");

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`retrieveChatroomForTerminal Valid Terminal: ${return1 == "111111"}`);
    console.log(`retrieveChatroomForTerminal Invalid Terminal: ${return2 == err.INVALID_CHANNEL_ID}`);
}

var checkAuthorLegitimacyTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 222);
    fw.addUser(111111, 333);
    fw.changeRegistration(111111, 333, "Y");

    dh.loadChatrooms();

    var return1 = dh.checkAuthorLegitimacy(222222, 222);
    var return2 = dh.checkAuthorLegitimacy(111111, 333);
    var return3 = dh.checkAuthorLegitimacy(111111, 444);
    var return4 = dh.checkAuthorLegitimacy(111111, 222);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`checkAuthorLegitimacy No Such Chatroom: ${return1 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`checkAuthorLegitimacy Registered User: ${return2 == true}`);
    console.log(`checkAuthorLegitimacy Invalid User: ${return3 == err.INVALID_USER_ID}`);
    console.log(`checkAuthorLegitimacy Unregistered User: ${return4 == err.USER_NOT_REGISTERED}`);
}

var retrieveUserDataTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);

    dh.loadChatrooms();

    var return1 = dh.retrieveUserData(222222, 2222222222222222);
    var return2 = dh.retrieveUserData(111111, 2222222222222222);
    var return3 = dh.retrieveUserData(111111, 3333333333333333);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`retrieveUser No Such Chatroom: ${return1 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`retrieveUser Valid User: ${JSON.stringify(return2) == JSON.stringify({"registered": "N", "username": "", "profilepic": ""})}`);
    console.log(`retrieveUser Invalid User: ${return3 == err.INVALID_USER_ID}`);
}

var isTerminalTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addChannel(111111, 4);

    dh.loadChatrooms();

    var return1 = dh.isTerminal(222222, 4);
    var return2 = dh.isTerminal(111111, 4);
    var return3 = dh.isTerminal(111111, 5);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`isTerminal No Such Chatroom: ${return1 == false}`);
    console.log(`isTerminal Valid Channel: ${return2 == true}`);
    console.log(`isTerminal Invalid Channel: ${return3 == false}`);
}

var isUserTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 4);

    dh.loadChatrooms();

    var return1 = dh.isUser(222222, 4);
    var return2 = dh.isUser(111111, 4);
    var return3 = dh.isUser(111111, 5);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`isUser No Such Chatroom: ${return1 == false}`);
    console.log(`isUser Valid User: ${return2 == true}`);
    console.log(`isUser Invalid User: ${return3 == false}`);
}

var isRegisteredUserTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 4);
    fw.addUser(111111, 6);
    fw.changeRegistration(111111, 4, "Y");

    dh.loadChatrooms();

    var return1 = dh.isRegisteredUser(222222, 4);
    var return2 = dh.isRegisteredUser(111111, 4);
    var return3 = dh.isRegisteredUser(111111, 5);
    var return4 = dh.isRegisteredUser(111111, 6);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`isRegisteredUser No Such Chatroom: ${return1 == false}`);
    console.log(`isRegisteredUser Registered User: ${return2 == true}`);
    console.log(`isRegisteredUser Invalid Channel: ${return3 == false}`);
    console.log(`isRegisteredUser Unregistered User: ${return4 == false}`);
}

var isAdminTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addAdmin(111111, 4);

    dh.loadChatrooms();

    var return1 = dh.isAdmin(222222, 4);
    var return2 = dh.isAdmin(111111, 4);
    var return3 = dh.isAdmin(111111, 5);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`isAdmin No Such Chatroom: ${return1 == false}`);
    console.log(`isAdmin Valid Admin: ${return2 == true}`);
    console.log(`isAdmin Invalid Admin: ${return3 == false}`);
}

var isOwnerTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    dh.loadChatrooms();

    var return1 = dh.isOwner(222222, 1111111111111111);
    var return2 = dh.isOwner(111111, 1111111111111111);
    var return3 = dh.isOwner(111111, 4);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`isOwner No Such Chatroom: ${return1 == false}`);
    console.log(`isOwner Valid Owner: ${return2 == true}`);
    console.log(`isOwner Invalid Owner: ${return3 == false}`);
}

var removeAdminTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addAdmin(111111, 4);
    fw.addAdmin(111111, 5);
    fw.addAdminMapping(4, 111111);
    fw.addAdminMapping(5, 111111);

    dh.loadChatrooms();

    var return1 = dh.removeAdmin(222222, 1111111111111111, 4);
    var return2 = dh.removeAdmin(111111, 1111111111111111, 4);
    var return3 = dh.removeAdmin(111111, 1111111111111111, 6);
    var return4 = dh.removeAdmin(111111, 2222222222222222, 5);
    var return5 = dh.removeAdmin(111111, 1111111111111111, 1111111111111111);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`removeAdmin Not Valid Chatroom: ${return1 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`removeAdmin Valid Request: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`removeAdmin Invalid Admin: ${return3 == err.CHATROOM_REMOVAL_ERROR}`);
    console.log(`removeAdmin Invalid Requester: ${return4 == err.INVALID_OWNER_ID}`);
    console.log(`removeAdmin Can't Remove Owner: ${return5 == err.INVALID_VALUE}`);
}

var removeTerminalTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addChannel(111111, 4);
    fw.addChannel(111111, 5);
    fw.addChannelMapping("4", "111111");
    fw.addChannelMapping("5", "111111");

    dh.loadChatrooms();

    var return1 = dh.removeTerminal(222222, 1111111111111111, 4);
    var return2 = dh.removeTerminal(111111, 1111111111111111, 4);
    var return3 = dh.removeTerminal(111111, 1111111111111111, 6);
    var return4 = dh.removeTerminal(111111, 2222222222222222, 5);
    
    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`removeTerminal No Such Chatroom: ${return1 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`removeTerminal Valid Request: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`removeTerminal Invalid Terminal: ${return3 == err.CHATROOM_REMOVAL_ERROR}`);
    console.log(`removeTerminal Invalid Requester: ${return4 == err.INVALID_ADMIN_ID}`);
}

var removeUserTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 4);
    fw.addUser(111111, 5);
    fw.addUserMapping(4, 111111);
    fw.addUserMapping(5, 111111);

    dh.loadChatrooms();

    var return1 = dh.removeUser(222222, 1111111111111111, 4);
    var return2 = dh.removeUser(111111, 1111111111111111, 4);
    var return3 = dh.removeUser(111111, 1111111111111111, 6);
    var return4 = dh.removeUser(111111, 2222222222222222, 5);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`removeUser Not Valid Chatroom: ${return1 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`removeUser Valid Request: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`removeUser Invalid User: ${return3 == err.CHATROOM_REMOVAL_ERROR}`);
    console.log(`removeUser Invalid Requester: ${return4 == err.INVALID_ADMIN_ID}`);
}

var registerTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 4);
    
    dh.loadChatrooms();

    var return1 = dh.register(222222, 4);
    var return2 = dh.register(111111, 4);
    var return3 = dh.register(111111, 5);

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`register No Such Chatroom: ${return1 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`register Valid User: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`register Invalid User: ${return3 == err.INVALID_USER_ID}`);
}

var updateUsernameTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 4);

    dh.loadChatrooms();

    var return1 = dh.updateUsername(222222, 4, "Hello World!");
    var return2 = dh.updateUsername(111111, 4, "Hello World!");
    var return3 = dh.updateUsername(111111, 4, "");
    var return4 = dh.updateUsername(111111, 4, "qwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiopqwertyuiop");
    var return5 = dh.updateUsername(111111, 4, 76);
    var return6 = dh.updateUsername(111111, 5, "Hello World!");

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`updateUsername No Such Chatroom: ${return1 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`updateUsername Valid Update: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`updateUsername Too Short Username: ${return3 == err.STRING_TOO_SHORT}`);
    console.log(`updateUsername Too Long Username: ${return4 == err.STRING_TOO_LONG}`);
    console.log(`updateUsername Invalid Type Username: ${return5 == err.INVALID_TYPE}`);
    console.log(`updateUsername Invalid User: ${return6 == err.INVALID_USER_ID}`);
}

var updateProfilePictureTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 4);

    dh.loadChatrooms();

    var return1 = dh.updateProfilePicture(222222, 4, "new link");
    var return2 = dh.updateProfilePicture(111111, 4, "new link");
    var return3 = dh.updateProfilePicture(111111, 5, "new link");

    dh.deleteChatroom(111111, 1111111111111111);

    console.log(`updateProfilePicture No Such Chatroom: ${return1 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`updateProfilePicture Valid User: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`updateProfilePicture Invalid User: ${return3 == err.INVALID_USER_ID}`);
}


//changeOwnerTests
//addAdminTests
//addUserTests
//addChannelTests
//loadChatroomsTests
//loadIndividualChatroomTests
//unloadIndividualChatroomTests
//loadChannelMappingTests
//createChatroomTests
//deleteChatroomTests

module.exports = {
    runtests(){
        retrieveOwnerTests();
        retrieveAdminsTests();
        retrieveTerminalsTests();
        retrieveUsersTests();
        retrieveLogTests();
        checkTerminalLegitimacyTests();
        retrieveChatroomForTerminalTests();
        checkAuthorLegitimacyTests();
        retrieveUserDataTests();
        isOwnerTests();
        isAdminTests();
        isTerminalTests();
        isUserTests();
        isRegisteredUserTests();
        removeAdminTests();
        removeTerminalTests();
        removeUserTests();
        registerTests();
        updateUsernameTests();
        updateProfilePictureTests();
    }
}