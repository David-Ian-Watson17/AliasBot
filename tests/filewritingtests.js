const fw = require('../code/filewriting.js');
const err = require('../returncodes.json');

var randomIdGeneratorTests = function(){
    console.log(fw.randomIdGenerator());
    console.log(fw.randomIdGenerator());
    console.log(fw.randomIdGenerator());
}

var createChatroomFilesTests = function(){
    var return1 = fw.createChatroomFiles(859432, 5493933485859349);
    var return2 = fw.createChatroomFiles(859432, 4487569293874928);
    var return3 = fw.createChatroomFiles(234859, 5493933485859349);
    var return4 = fw.createChatroomFiles("234859", 3423451235534234);
    var return5 = fw.createChatroomFiles("999999", "3495039458069345");
    console.log(`createChatroomFiles Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`createChatroomFiles Same Chatroom ID: ${return2 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`createChatroomFiles Same Owner ID: ${return3 == err.GOOD_EXECUTE}`);
    console.log(`createChatroomFiles Copy String Chatroom ID: ${return4 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`createChatroomFiles String Chatroom ID and OWNER ID: ${return5 == err.GOOD_EXECUTE}`);
    fw.deleteChatroomFiles(859432);
    fw.deleteChatroomFiles(234859);
    fw.deleteChatroomFiles(999999);
}

var deleteChatroomFilesTests = function(){
    fw.createChatroomFiles(123456, 4758949302938457);
    fw.createChatroomFiles(234567, 3456345453452345);
    var return1 = fw.deleteChatroomFiles(123456);
    var return2 = fw.deleteChatroomFiles(574832);
    var return3 = fw.deleteChatroomFiles(3456345453452345);
    var return4 = fw.deleteChatroomFiles(-234524);
    var return5 = fw.deleteChatroomFiles("234567");
    console.log(`deleteChatroomFiles Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`deleteChatroomFiles Chatroom Doesn't Exist: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`deleteChatroomFiles Owner ID: ${return3 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`deleteChatroomFiles Negative Value: ${return4 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`deleteChatroomFiles String Value: ${return5 == err.GOOD_EXECUTE}`);
}

var addOwnerMappingTests = function(){
    var return1 = fw.addOwnerMapping(1458929349230494, 543234);
    var return2 = fw.addOwnerMapping(1458929349230494, 342341);
    var return3 = fw.addOwnerMapping(2342395930948864, 543234);
    var return4 = fw.addOwnerMapping(2342395930948864, 943858);
    var return5 = fw.addOwnerMapping(1458929349230494, 342341);
    console.log(`addOwnerMapping Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`addOwnerMapping New Chatroom ID Same Owner ID: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`addOwnerMapping Same Chatroom ID New Owner ID: ${return3 == err.GOOD_EXECUTE}`);
    console.log(`addOwnerMapping New Chatroom and Owner ID: ${return4 == err.GOOD_EXECUTE}`);
    console.log(`addOwnerMapping Same Chatroom and Owner ID: ${return5 == err.VALUE_ALREADY_PRESENT}`);
    fw.removeOwnerMapping(2342395930948864, 943858);
    fw.removeOwnerMapping(2342395930948864, 543234);
}

var removeOwnerMappingTests = function(){
    var return1 = fw.removeOwnerMapping(1458929349230494, 543234);
    var return2 = fw.removeOwnerMapping(1458929349230494, 111111);
    var return3 = fw.removeOwnerMapping(1111111111111111, 342341);
    var return4 = fw.removeOwnerMapping(1111111111111111, 111111);
    var return5 = fw.removeOwnerMapping("1458929349230494", "342341");
    console.log(`removeOwnerMapping Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`removeOwnerMapping Valid Owner ID Invalid Chatroom ID: ${return2 == err.VALUE_NOT_PRESENT}`);
    console.log(`removeOwnerMapping Invalid Owner ID Valid Chatroom ID: ${return3 == err.INVALID_OWNER_ID}`);
    console.log(`removeOwnerMapping Invalid Owner ID Invalid Chatroom ID: ${return4 == err.INVALID_OWNER_ID}`);
    console.log(`removeOwnerMapping String Owner ID String Chatroom ID: ${return5 == err.GOOD_EXECUTE}`);
}

var addAdminMappingTests = function(){
    var return1 = fw.addAdminMapping(1111111111111111, 111111);
    var return2 = fw.addAdminMapping(1111111111111111, 222222);
    var return3 = fw.addAdminMapping(2222222222222222, 111111);
    var return4 = fw.addAdminMapping(3333333333333333, 333333);
    var return5 = fw.addAdminMapping(1111111111111111, 111111);
    console.log(`addAdminMapping Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`addAdminMapping New Chatroom ID Same Admin ID: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`addAdminMapping Same Chatroom ID New Admin ID: ${return3 == err.GOOD_EXECUTE}`);
    console.log(`addAdminMapping New Chatroom and Admin ID: ${return4 == err.GOOD_EXECUTE}`);
    console.log(`addAdminMapping Same Chatroom and Admin ID: ${return5 == err.VALUE_ALREADY_PRESENT}`);
    fw.removeAdminMapping(2222222222222222, 111111);
    fw.removeAdminMapping(3333333333333333, 333333);
}

var removeAdminMappingTests = function(){
    var return1 = fw.removeAdminMapping(1111111111111111, 111111);
    var return2 = fw.removeAdminMapping(1111111111111111, 555555);
    var return3 = fw.removeAdminMapping(5555555555555555, 222222);
    var return4 = fw.removeAdminMapping(5555555555555555, 555555);
    var return5 = fw.removeAdminMapping("1111111111111111", "222222");
    console.log(`removeAdminMapping Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`removeAdminMapping Valid Admin ID Invalid Chatroom ID: ${return2 == err.VALUE_NOT_PRESENT}`);
    console.log(`removeAdminMapping Invalid Admin ID Valid Chatroom ID: ${return3 == err.INVALID_ADMIN_ID}`);
    console.log(`removeAdminMapping Invalid Admin ID Invalid Chatroom ID: ${return4 == err.INVALID_ADMIN_ID}`);
    console.log(`removeAdminMapping String Admin ID String Chatroom ID: ${return5 == err.GOOD_EXECUTE}`);
}

var addUserMappingTests = function(){
    var return1 = fw.addUserMapping(1111111111111111, 111111);
    var return2 = fw.addUserMapping(1111111111111111, 222222);
    var return3 = fw.addUserMapping(2222222222222222, 111111);
    var return4 = fw.addUserMapping(3333333333333333, 333333);
    var return5 = fw.addUserMapping(1111111111111111, 111111);
    console.log(`addUserMapping Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`addUserMapping New Chatroom ID Same User ID: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`addUserMapping Same Chatroom ID New User ID: ${return3 == err.GOOD_EXECUTE}`);
    console.log(`addUserMapping New Chatroom and User ID: ${return4 == err.GOOD_EXECUTE}`);
    console.log(`addUserMapping Same Chatroom and User ID: ${return5 == err.VALUE_ALREADY_PRESENT}`);
    fw.removeUserMapping(2222222222222222, 111111);
    fw.removeUserMapping(3333333333333333, 333333);
}

var removeUserMappingTests = function(){
    var return1 = fw.removeUserMapping(1111111111111111, 111111);
    var return2 = fw.removeUserMapping(1111111111111111, 555555);
    var return3 = fw.removeUserMapping(5555555555555555, 222222);
    var return4 = fw.removeUserMapping(5555555555555555, 555555);
    var return5 = fw.removeUserMapping("1111111111111111", "222222");
    console.log(`removeUserMapping Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`removeUserMapping Valid User ID Invalid Chatroom ID: ${return2 == err.VALUE_NOT_PRESENT}`);
    console.log(`removeUserMapping Invalid User ID Valid Chatroom ID: ${return3 == err.INVALID_USER_ID}`);
    console.log(`removeUserMapping Invalid User ID Invalid Chatroom ID: ${return4 == err.INVALID_USER_ID}`);
    console.log(`removeUserMapping String User ID String Chatroom ID: ${return5 == err.GOOD_EXECUTE}`);
}

var addChannelMappingTests = function(){
    var return1 = fw.addChannelMapping(1111111111111111, 111111);
    var return2 = fw.addChannelMapping(1111111111111111, 222222);
    var return3 = fw.addChannelMapping(2222222222222222, 111111);
    var return4 = fw.addChannelMapping(3333333333333333, 333333);
    var return5 = fw.addChannelMapping(1111111111111111, 111111);
    console.log(`addChannelMapping Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`addChannelMapping New Chatroom ID Same User ID: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`addChannelMapping Same Chatroom ID New User ID: ${return3 == err.GOOD_EXECUTE}`);
    console.log(`addChannelMapping New Chatroom and User ID: ${return4 == err.GOOD_EXECUTE}`);
    console.log(`addChannelMapping Same Chatroom and User ID: ${return5 == err.VALUE_ALREADY_PRESENT}`);
    fw.removeChannelMapping(3333333333333333, 333333);
    fw.removeChannelMapping(2222222222222222, 111111);
}

var removeChannelMappingTests = function(){
    var return1 = fw.removeChannelMapping(1111111111111111, 111111);
    var return2 = fw.removeChannelMapping(1111111111111111, 555555);
    var return3 = fw.removeChannelMapping(5555555555555555, 222222);
    var return4 = fw.removeChannelMapping(5555555555555555, 555555);
    var return5 = fw.removeChannelMapping("1111111111111111", "222222");
    console.log(`removeChannelMapping Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`removeChannelMapping Valid Channel ID Invalid Chatroom ID: ${return2 == err.VALUE_NOT_PRESENT}`);
    console.log(`removeChannelMapping Invalid Channel ID Valid Chatroom ID: ${return3 == err.INVALID_CHANNEL_ID}`);
    console.log(`removeChannelMapping Invalid Channel ID Invalid Chatroom ID: ${return4 == err.INVALID_CHANNEL_ID}`);
    console.log(`removeChannelMapping String Channel ID String Chatroom ID: ${return5 == err.GOOD_EXECUTE}`);
}

var changeOwnerTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fw.changeOwner(111111, 2222222222222222);
    var return2 = fw.changeOwner(222222, 2222222222222222);
    var return3 = fw.changeOwner(111111, 2222222222222222);
    var return4 = fw.changeOwner(111111, "2222222222222222");
    var return5 = fw.changeOwner("111111", 3333333333333333);
    console.log(`changeOwner Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`changeOwner Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`changeOwner Same Owner: ${return3 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`changeOwner String Same Owner: ${return4 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`changeOwner String Chatroom: ${return5 == err.GOOD_EXECUTE}`);

    fw.deleteChatroomFiles(111111);
}

var addAdminTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fw.addAdmin(111111, 2222222222222222);
    var return2 = fw.addAdmin(222222, 3333333333333333);
    var return3 = fw.addAdmin(111111, 3333333333333333);
    var return4 = fw.addAdmin(111111, 2222222222222222);
    var return5 = fw.addAdmin(111111, "2222222222222222");
    var return6 = fw.addAdmin("111111", 4444444444444444);
    var return7 = fw.addAdmin(111111, 1111111111111111)
    console.log(`addAdmin Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`addAdmin Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`addAdmin New Admin: ${return3 == err.GOOD_EXECUTE}`);
    console.log(`addAdmin Same Admin: ${return4 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`addAdmin String Same Admin: ${return5 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`addAdmin String Chatroom: ${return6 == err.GOOD_EXECUTE}`);
    console.log(`addAdmin Owner is Auto Admin: ${return7 == err.VALUE_ALREADY_PRESENT}`);

    fw.deleteChatroomFiles(111111);
}

var removeAdminTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addAdmin(111111, 2222222222222222);
    fw.addAdmin(111111, 3333333333333333);

    var return1 = fw.removeAdmin(111111, 2222222222222222);
    var return2 = fw.removeAdmin(222222, 3333333333333333);
    var return3 = fw.removeAdmin(111111, 5555555555555555);
    var return4 = fw.removeAdmin(111111, "3333333333333333");
    console.log(`removeAdmin Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`removeAdmin Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`removeAdmin Valid Chatroom Invalid Admin: ${return3 == err.VALUE_NOT_PRESENT}`);
    console.log(`removeAdmin String Admin: ${return4 == err.GOOD_EXECUTE}`);

    fw.deleteChatroomFiles(111111);
}

var addChannelTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fw.addChannel(111111, 2222222222222222);
    var return2 = fw.addChannel(222222, 3333333333333333);
    var return3 = fw.addChannel(111111, 3333333333333333);
    var return4 = fw.addChannel(111111, 2222222222222222);
    var return5 = fw.addChannel(111111, "2222222222222222");
    var return6 = fw.addChannel("111111", 4444444444444444);
    console.log(`addChannel Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`addChannel Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`addChannel New Channel: ${return3 == err.GOOD_EXECUTE}`);
    console.log(`addChannel Same Channel: ${return4 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`addChannel String Same Channel: ${return5 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`addChannel String Chatroom: ${return6 == err.GOOD_EXECUTE}`);

    fw.deleteChatroomFiles(111111);
}

var removeChannelTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addChannel(111111, 2222222222222222);
    fw.addChannel(111111, 3333333333333333);

    var return1 = fw.removeChannel(111111, 2222222222222222);
    var return2 = fw.removeChannel(222222, 3333333333333333);
    var return3 = fw.removeChannel(111111, 5555555555555555);
    var return4 = fw.removeChannel(111111, "3333333333333333");
    console.log(`removeChannel Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`removeChannel Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`removeChannel Valid Chatroom Invalid Channel: ${return3 == err.VALUE_NOT_PRESENT}`);
    console.log(`removeChannel String Channel: ${return4 == err.GOOD_EXECUTE}`);

    fw.deleteChatroomFiles(111111);
}

var addUserTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);

    var return1 = fw.addUser(111111, 1111111111111111);
    var return2 = fw.addUser(222222, 2222222222222222);
    var return3 = fw.addUser(111111, 1111111111111111);
    var return4 = fw.addUser(111111, "1111111111111111");
    console.log(`addUser Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`addUser Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`addUser User Already Entered: ${return3 == err.VALUE_ALREADY_PRESENT}`);
    console.log(`addUser User Already Entered String: ${return4 == err.VALUE_ALREADY_PRESENT}`);

    fw.deleteChatroomFiles(111111);
}

var removeUserTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);
    fw.addUser(111111, 3333333333333333);

    var return1 = fw.removeUser(111111, 2222222222222222);
    var return2 = fw.removeUser(222222, 3333333333333333);
    var return3 = fw.removeUser(111111, 8888888888888888);
    var return4 = fw.removeUser(111111, "3333333333333333");
    console.log(`removeUser Standard: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`removeUser Invalid Chatroom: ${return2 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`removeUser Invalid User: ${return3 == err.VALUE_NOT_PRESENT}`);
    console.log(`removeUser String Valid User: ${return4 == err.GOOD_EXECUTE}`);

    fw.deleteChatroomFiles(111111);
}

var changeUsernameTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);
    
    var return1 = fw.changeUsername(111111, 2222222222222222, "hello");
    var return2 = fw.changeUsername(111111, 2222222222222222, "no u");
    var return3 = fw.changeUsername(111111, 2222222222222222, 857);
    var return4 = fw.changeUsername(111111, 2222222222222222, "jfkdjglfkgjfkdjglfkgjfkdjglfkgjfkdjglfkgjfkdjglfkgjfkdjglfkgjfkdjglfkgjfkdjglfkgj");
    var return5 = fw.changeUsername(222222, 2222222222222222, "hello");
    var return6 = fw.changeUsername(111111, 5555555555555555, "hello");
    console.log(`changeUsername Creating First Username: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`changeUsername Changing Current Username: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`changeUsername Not a String: ${return3 == err.INVALID_TYPE}`);
    console.log(`changeUsername Too Long: ${return4 == err.STRING_TOO_LONG}`);
    console.log(`changeUsername Invalid Chatroom: ${return5 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`changeUsername Invalid User ID: ${return6 == err.INVALID_USER_ID}`);

    fw.deleteChatroomFiles(111111);
}

var changeProfilePictureTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);
    
    var return1 = fw.changeProfilePicture(111111, 2222222222222222, "hello");
    var return2 = fw.changeProfilePicture(111111, 2222222222222222, "no u");
    var return3 = fw.changeProfilePicture(111111, 2222222222222222, 857);
    var return4 = fw.changeProfilePicture(222222, 2222222222222222, "hello");
    var return5 = fw.changeProfilePicture(111111, 5555555555555555, "hello");
    console.log(`changeProfilePicture Creating First ProfilePicture: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`changeProfilePicture Changing Current ProfilePicture: ${return2 == err.GOOD_EXECUTE}`);
    console.log(`changeProfilePicture Not a String: ${return3 == err.INVALID_VALUE}`);
    console.log(`changeProfilePicture Invalid Chatroom: ${return4 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`changeProfilePicture Invalid User ID: ${return5 == err.INVALID_USER_ID}`);

    fw.deleteChatroomFiles(111111);
}

var changeRegistrationTests = function(){
    fw.createChatroomFiles(111111, 1111111111111111);
    fw.addUser(111111, 2222222222222222);
    
    var return1 = fw.changeRegistration(111111, 2222222222222222, "Y");
    var return2 = fw.changeRegistration(111111, 2222222222222222, 857);
    var return3 = fw.changeRegistration(222222, 2222222222222222, "N");
    var return4 = fw.changeRegistration(111111, 5555555555555555, "N");
    var return5 = fw.changeRegistration(111111, 2222222222222222, "G");
    console.log(`changeRegistration Changing Current Registration: ${return1 == err.GOOD_EXECUTE}`);
    console.log(`changeRegistration Not a String: ${return2 == err.INVALID_VALUE}`);
    console.log(`changeRegistration Invalid Chatroom: ${return3 == err.CHATROOM_DOESNT_EXIST}`);
    console.log(`changeRegistration Invalid User ID: ${return4 == err.INVALID_USER_ID}`);
    console.log(`changeRegistration Not a valid value: ${return5 == err.INVALID_VALUE}`);

    fw.deleteChatroomFiles(111111);
}

module.exports = {
    runtests(){
        randomIdGeneratorTests();
        createChatroomFilesTests();
        deleteChatroomFilesTests();
        addOwnerMappingTests();
        addAdminMappingTests();
        addUserMappingTests();
        addChannelMappingTests();
        removeOwnerMappingTests();
        removeAdminMappingTests();
        removeUserMappingTests();
        removeChannelMappingTests();
        changeOwnerTests();
        addAdminTests();
        removeAdminTests();
        addUserTests();
        removeUserTests();
        addChannelTests();
        removeChannelTests();
        addUserTests();
        removeUserTests();
        changeUsernameTests();
        changeProfilePictureTests();
        changeRegistrationTests();
    }
}
/*
List of Functions
-----------------
randomIdGenerator
createChatroomFiles
deleteChatroomFiles
addOwnerMapping
addAdminMapping
addUserMapping
addChannelMapping
removeOwnerMapping
removeAdminMapping
removeUserMapping
removeChannelMapping
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