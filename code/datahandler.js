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
loadChannelMapping
loadUserMapping
------------- Verification Functions
isTerminal
registrationStatus
isAdmin
isOwner
------------- Update Functions
register
updateUsername
updateProfilePicture
------------- Message Sending Functions
retrieveOtherTerminals
retrieve


*/
var fw = require('./filewriting.js');
var fr = require('./filereading.js');

var ChatroomData;
var ChannelMapping;
var UserMapping;

