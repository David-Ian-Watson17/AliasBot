var verif = require('../code/verification.js');
var err = require('../returncodes.json');

var validUserTests = function(){
    var return1 = verif.validGuild("981286460449783809");
    var return2 = verif.validGuild("935009657838272522");
    var return3 = verif.validGuild("dfjlkjgldkfjsdlkfj");
    var return4 = verif.validGuild("68943045");
    console.log(`validGuild Valid: ${return1 == true}`);
    console.log(`validGuild Inaccessible: ${return2 == false}`);
    console.log(`validGuild Gibberish String: ${return3 == false}`);
    console.log(`validGuild Invalid Number: ${return4 == false}`);
}

var validChannelTests = function(){
    var return1 = verif.validChannel("981286461007618130");
    var return2 = verif.validChannel("981274551306571787");
    var return3 = verif.validChannel("dfjlkjgUsernameldkfjsdlkfj");
    var return4 = verif.validChannel("68943045");
    console.log(`validChannel Valid: ${return1 == true}`);
    console.log(`validChannel Inaccessible: ${return2 == false}`);
    console.log(`validChannel Gibberish String: ${return3 == false}`);
    console.log(`validChannel Invalid Number: ${return4 == false}`);
}

var validGuildTests = function(){
    var return1 = verif.validUser("317499541156790273");
    var return2 = verif.validUser("786792919289430066");
    var return3 = verif.validUser("dfjlkjgldkfjsdlkfj");
    var return4 = verif.validUser("68943045");
    var return5 = verif.validUser("981272780626612284")
    console.log(`validUser Valid: ${return1 == true}`);
    console.log(`validUser Inaccessible: ${return2 == false}`);
    console.log(`validUser Gibberish String: ${return3 == false}`);
    console.log(`validUser Invalid Number: ${return4 == false}`);
    console.log(`validUser Own ID: ${return5 == true}`);
}

var validUsernameTests = function(){
    var return1 = verif.validUsername("hello");
    var return2 = verif.validUsername(58);
    var return3 = verif.validUsername("");
    var return4 = verif.validUsername("asdfghjklpasdfghjklpasdfghjklpasdfghjklpasdfghjklpasdfghjklpasdfghjklpasdfghjklpa");
    console.log(`validUsername Valid String: ${return1 == true}`);
    console.log(`validUsername Not a String: ${return2 == err.INVALID_TYPE}`);
    console.log(`validUsername Empty String: ${return3 == err.STRING_TOO_SHORT}`);
    console.log(`validUsername Too Long: ${return4 == err.STRING_TOO_LONG}`);
}

module.exports = {
    runtests(){
        validUserTests();
        validChannelTests();
        validGuildTests();
        validUsernameTests();
    }
}