var fr = require('../chatroomcode/filereading.js');
var fw = require('../chatroomcode/filewriting.js');
var err = require('../returncodes.json');

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

var ownerOfTests = function(){
    fw.addOwnerMapping(1111111111111111, 111111);
    fw.addOwnerMapping(1111111111111111, 222222);
    fw.addOwnerMapping(1111111111111111, 333333);

    var return1 = fr.ownerOf(1111111111111111);
    var return2 = fr.ownerOf(2222222222222222);
    var return3 = fr.ownerOf("1111111111111111");
    console.log(`ownerOfTests Standard: ${return1.equals(["111111", "222222", "333333"])}`);
    console.log(`ownerOfTests invalidUser: ${return2.equals([])}`);
    console.log(`ownerOfTests String: ${return3.equals(["111111", "222222", "333333"])}`);

    fw.removeOwnerMapping(1111111111111111, 111111);
    fw.removeOwnerMapping(1111111111111111, 222222);
    fw.removeOwnerMapping(1111111111111111, 333333);
}

var adminForTests = function(){
    fw.addAdminMapping(1111111111111111, 111111);
    fw.addAdminMapping(1111111111111111, 222222);
    fw.addAdminMapping(1111111111111111, 333333);

    var return1 = fr.adminFor(1111111111111111);
    var return2 = fr.adminFor(2222222222222222);
    var return3 = fr.adminFor("1111111111111111");
    console.log(`adminForTests Standard: ${return1.equals(["111111", "222222", "333333"])}`);
    console.log(`adminForTests invalidUser: ${return2.equals([])}`);
    console.log(`adminForTests String: ${return3.equals(["111111", "222222", "333333"])}`);

    fw.removeAdminMapping(1111111111111111, 111111);
    fw.removeAdminMapping(1111111111111111, 222222);
    fw.removeAdminMapping(1111111111111111, 333333);
}

var terminalInTests = function(){
    fw.addChannelMapping(1111111111111111, 111111);
    fw.addChannelMapping(1111111111111111, 222222);
    fw.addChannelMapping(1111111111111111, 333333);

    var return1 = fr.terminalIn(1111111111111111);
    var return2 = fr.terminalIn(2222222222222222);
    var return3 = fr.terminalIn("1111111111111111");
    console.log(`terminalInTests Standard: ${return1.equals(["111111", "222222", "333333"])}`);
    console.log(`terminalInTests invalidUser: ${return2.equals([])}`);
    console.log(`terminalInTests String: ${return3.equals(["111111", "222222", "333333"])}`);

    fw.removeChannelMapping(1111111111111111, 111111);
    fw.removeChannelMapping(1111111111111111, 222222);
    fw.removeChannelMapping(1111111111111111, 333333);
}

var userInTests = function(){
    fw.addUserMapping(1111111111111111, 111111);
    fw.addUserMapping(1111111111111111, 222222);
    fw.addUserMapping(1111111111111111, 333333);

    var return1 = fr.userIn(1111111111111111);
    var return2 = fr.userIn(2222222222222222);
    var return3 = fr.userIn("1111111111111111");
    console.log(`userInTests Standard: ${return1.equals(["111111", "222222", "333333"])}`);
    console.log(`userInTests invalidUser: ${return2.equals([])}`);
    console.log(`userInTests String: ${return3.equals(["111111", "222222", "333333"])}`);

    fw.removeUserMapping(1111111111111111, 111111);
    fw.removeUserMapping(1111111111111111, 222222);
    fw.removeUserMapping(1111111111111111, 333333);
}

var isOwnerTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fr.isOwner(111111, 1111111111111111);
    var return2 = fr.isOwner(222222, 1111111111111111);
    var return3 = fr.isOwner(111111, 2222222222222222);
    
    fw.changeOwner(111111, 2222222222222222);

    var return4 = fr.isOwner(111111, 1111111111111111);
    var return5 = fr.isOwner(111111, 2222222222222222);
    console.log(`isOwner Valid Owner: ${return1 == true}`);
    console.log(`isOwner Invalid Chatroom: ${return2 == false}`);
    console.log(`isOwner Wrong Owner: ${return3 == false}`);
    console.log(`isOwner Old Owner After Changing: ${return4 == false}`);
    console.log(`isOwner New Owner After Changing: ${return5 == true}`);

    fw.deleteChatroomFiles(111111);
}

var isAdminTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fr.isAdmin(111111, 1111111111111111);
    var return2 = fr.isAdmin(111111, 2222222222222222);
    var return3 = fr.isAdmin(222222, 1111111111111111);

    fw.addAdmin(111111, 2222222222222222);

    var return4 = fr.isAdmin(111111, 1111111111111111);
    var return5 = fr.isAdmin(111111, 2222222222222222);
    
    fw.removeAdmin(111111, 2222222222222222);

    var return6 = fr.isAdmin(111111, 1111111111111111);
    var return7 = fr.isAdmin(111111, 2222222222222222);

    console.log(`isAdmin Owner Is Admin: ${return1 == true}`);
    console.log(`isAdmin Invalid Admin: ${return2 == false}`);
    console.log(`isAdmin Invalid Chatroom: ${return3 == false}`);
    console.log(`isAdmin Old Admin Still Admin: ${return4 == true}`);
    console.log(`isAdmin New Admin Also Admin: ${return5 == true}`);
    console.log(`isAdmin Unremoved Admin Still Admin: ${return6 == true}`);
    console.log(`isAdmin Removed Admin Not Admin: ${return7 == false}`);
}

var isTerminalTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addChannel(111111, 5555555555555555);

    var return1 = fr.isTerminal(111111, 5555555555555555);
    var return2 = fr.isTerminal(111111, 4444444444444444);
    var return3 = fr.isTerminal(111111, 1111111111111111);
    var return4 = fr.isTerminal(222222, 5555555555555555);

    fw.addChannel(111111, 1111111111111111);

    var return5 = fr.isTerminal(111111, 1111111111111111);
    var return6 = fr.isTerminal(111111, 5555555555555555);

    fw.removeChannel(111111, 5555555555555555);

    var return7 = fr.isTerminal(111111, 5555555555555555);
    var return8 = fr.isTerminal(111111, 1111111111111111);

    console.log(`isTerminal Added Channel is Terminal: ${return1 == true}`);
    console.log(`isTerminal Invalid Channel not Terminal: ${return2 == false}`);
    console.log(`isTerminal Owner ID is not added as Terminal: ${return3 == false}`);
    console.log(`isTerminal Invalid Chatroom: ${return4 == false}`);
    console.log(`isTerminal New Channel is Terminal: ${return5 == true}`);
    console.log(`isTerminal Old Channel is still Terminal: ${return6 == true}`);
    console.log(`isTerminal Removed Channel is not Terminal: ${return7 == false}`);
    console.log(`isTerminal Non-Removed Channel is still Terminal: ${return8 == true}`);
}

var isUserTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 5555555555555555);

    var return1 = fr.isUser(111111, 5555555555555555);
    var return2 = fr.isUser(111111, 4444444444444444);
    var return3 = fr.isUser(111111, 1111111111111111);
    var return4 = fr.isUser(222222, 5555555555555555);

    fw.addUser(111111, 1111111111111111);

    var return5 = fr.isUser(111111, 1111111111111111);
    var return6 = fr.isUser(111111, 5555555555555555);

    fw.removeUser(111111, 5555555555555555);

    var return7 = fr.isUser(111111, 5555555555555555);
    var return8 = fr.isUser(111111, 1111111111111111);

    console.log(`isUser Added User is User: ${return1 == true}`);
    console.log(`isUser Invalid User not User: ${return2 == false}`);
    console.log(`isUser Owner ID is not added as User: ${return3 == false}`);
    console.log(`isUser Invalid Chatroom: ${return4 == false}`);
    console.log(`isUser New User is User: ${return5 == true}`);
    console.log(`isUser Old User is still User: ${return6 == true}`);
    console.log(`isUser Removed User is not User: ${return7 == false}`);
    console.log(`isUser Non-Removed User is still User: ${return8 == true}`);

    //fw.deleteChatroomFiles(111111);
}

var isRegisteredUserTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);

    var return1 = fr.isRegisteredUser(111111, 2222222222222222);
    var return2 = fr.isRegisteredUser(111111, 1111111111111111);
    
    fw.changeRegistration(111111, 2222222222222222, "Y");

    var return3 = fr.isRegisteredUser(111111, 2222222222222222);
    var return4 = fr.isRegisteredUser(222222, 2222222222222222);

    console.log(`isRegisteredUser Added User is not Registered: ${return1 == false}`);
    console.log(`isRegisteredUser Owner is not Registered User: ${return2 == false}`);
    console.log(`isRegisteredUser Newly Registered User is Registered User: ${return3 == true}`);
    console.log(`isRegisteredUser Invalid Chatroom: ${return4 == false}`);

    fw.deleteChatroomFiles(111111);
}

var usernameTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);

    var return1 = fr.username(111111, 2222222222222222);
    var return2 = fr.username(222222, 2222222222222222);
    var return3 = fr.username(111111, 3333333333333333);
    
    fw.changeUsername(111111, 2222222222222222, "Hello World!");

    var return4 = fr.username(111111, 2222222222222222);

    console.log(`username New User Username is "": ${return1 == ""}`);
    console.log(`username Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`username Invalid User: ${return3 == err.INVALID_USER_ID}`);
    console.log(`username Changed Username is "Hello World!": ${return4 == "Hello World!"}`);

    fw.deleteChatroomFiles(111111);
}

var profilePictureTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);

    var return1 = fr.profilePicture(111111, 2222222222222222);
    var return2 = fr.profilePicture(222222, 2222222222222222);
    var return3 = fr.profilePicture(111111, 3333333333333333);
    
    fw.changeProfilePicture(111111, 2222222222222222, "Hello World!");

    var return4 = fr.profilePicture(111111, 2222222222222222);

    console.log(`profilePicture New User Profile Pic Link is "": ${return1 == ""}`);
    console.log(`profilePicture Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`profilePicture Invalid User: ${return3 == err.INVALID_USER_ID}`);
    console.log(`profilePicture Changed Profile Pic Link is "Hello World!": ${return4 == "Hello World!"}`);

    fw.deleteChatroomFiles(111111);
}

var retrieveAllChatroomIdsTests = function(){
    var return1 = fr.retrieveAllChatroomIds();
    
    fw.createChatroomFiles(111111);
    
    var return2 = fr.retrieveAllChatroomIds();

    fw.createChatroomFiles(222222);

    var return3 = fr.retrieveAllChatroomIds();

    console.log(`retrieveAllChatroomIds no chatrooms: ${return1.equals([])}`);
    console.log(`retrieveAllChatroomIds one chatroom: ${return2.equals(["111111"])}`);
    console.log(`retrieveAllChatroomIds two chatrooms: ${return3.equals(["111111", "222222"])}`);

    fw.deleteChatroomFiles(111111);
    fw.deleteChatroomFiles(222222);
}

var retrieveOwnerTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fr.retrieveOwner(111111);
    var return2 = fr.retrieveOwner(222222);

    fw.changeOwner(111111, 2222222222222222);

    var return3 = fr.retrieveOwner(111111);

    console.log(`retrieveOwner Standard: ${return1 == "1111111111111111"}`);
    console.log(`retrieveOwner Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`retrieveOwner Modified Owner: ${return3 == "2222222222222222"}`);

    fw.deleteChatroomFiles(111111);
}

var retrieveAdminsTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    
    var return1 = fr.retrieveAdmins(111111);
    var return2 = fr.retrieveAdmins(222222);
    
    fw.removeAdmin(111111, 1111111111111111);

    var return3 = fr.retrieveAdmins(111111);

    fw.addAdmin(111111, 1111111111111111);
    fw.addAdmin(111111, 2222222222222222);

    var return4 = fr.retrieveAdmins(111111);

    console.log(`retrieveAdmins Newly Created is Array With Owner: ${return1.equals(["1111111111111111"])}`);
    console.log(`retrieveAdmins Wrong Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`retrieveAdmins No Admins: ${return3.equals([])}`);
    console.log(`retrieveAdmins Multiple Admins: ${return4.equals(["1111111111111111", "2222222222222222"])}`);

    fw.deleteChatroomFiles(111111);
}

var retrieveTerminalsTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    
    var return1 = fr.retrieveTerminals(111111);
    var return2 = fr.retrieveTerminals(222222);

    fw.addChannel(111111, 1111111111111111);

    var return3 = fr.retrieveTerminals(111111);

    fw.addChannel(111111, 2222222222222222);

    var return4 = fr.retrieveTerminals(111111);

    console.log(`retrieveTerminals Newly Created is Array With No Terminals: ${return1.equals([])}`);
    console.log(`retrieveTerminals Wrong Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`retrieveTerminals One Terminal: ${return3.equals(["1111111111111111"])}`);
    console.log(`retrieveTerminals Multiple Terminals: ${return4.equals(["1111111111111111", "2222222222222222"])}`);

    fw.deleteChatroomFiles(111111);
}

var retrieveUsersTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fr.retrieveUsers(111111);
    var return2 = fr.retrieveUsers(222222);

    fw.addUser(111111, 2222222222222222);

    var return3 = fr.retrieveUsers(111111);

    fw.addUser(111111, 3333333333333333);

    var return4 = fr.retrieveUsers(111111);

    fw.changeRegistration(111111, 2222222222222222, "Y");

    var return5 = fr.retrieveUsers(111111);

    console.log(`retrieveUsers No Users: ${JSON.stringify(return1) == JSON.stringify({})}`);
    console.log(`retrieveUsers Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`retrieveUsers One User: ${JSON.stringify(return3) == JSON.stringify({"2222222222222222": {"registered": "N", "username": "", "profilepic": ""}})}`);
    console.log(`retrieveUsers Multiple Users: ${JSON.stringify(return4) == JSON.stringify({"2222222222222222": {"registered": "N", "username":"", "profilepic":""}, "3333333333333333": {"registered": "N", "username":"", "profilepic":""}})}`);
    console.log(`retrieveUsers Change Status: ${JSON.stringify(return5) == JSON.stringify({"2222222222222222": {"registered": "Y", "username":"", "profilepic":""}, "3333333333333333": {"registered": "N", "username":"", "profilepic":""}})}`);

    fw.deleteChatroomFiles(111111);
}

var retrieveLogTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fr.retrieveLog(111111);
    var return2 = fr.retrieveLog(222222);

    fw.logEvent(111111, 1111111111111111, "M", "Hello World!");

    var return3 = fr.retrieveLog(111111);

    fw.logEvent(111111, 2222222222222222, "UU", "Updated!");

    var return4 = fr.retrieveLog(111111);

    console.log(`retrieveLog Empty Log: ${return1.equals([])}`);
    console.log(`retrieveLog Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`retrieveLog One Entry: ${return3.equals(["1111111111111111  M  Hello World!"])}`);
    console.log(`retrieveLog Multiple Entries: ${return4.equals(["1111111111111111  M  Hello World!", "2222222222222222  UU  Updated!"])}`);

    fw.deleteChatroomFiles(111111);
}

module.exports = {
    runtests(){
        ownerOfTests();
        adminForTests();
        terminalInTests();
        userInTests();
        isOwnerTests();
        isAdminTests();
        isTerminalTests();
        isUserTests();
        isRegisteredUserTests();
        usernameTests();
        profilePictureTests();
        retrieveAllChatroomIdsTests();
        retrieveOwnerTests();
        retrieveAdminsTests();
        retrieveTerminalsTests();
        retrieveUsersTests();
        retrieveLogTests();
    }
}