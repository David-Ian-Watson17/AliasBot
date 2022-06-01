<h1>Aliasbot</h1>

Hello, welcome to AliasBot!

Aliasbot is designed to allow the creation of anonymous chatrooms, where you can create an alias that will be portrayed to other members of the chatroom without revealing your original profile! To put it simply, it creates a simple version of Discord's group DMs inside of Discord.

Channels can be added to a chatroom as terminals, where registered users can send messages via their alias. The whole chatroom's records are kept in a log file. 

--------------------------------------------------------------

<h3>Permissions</h3>

There are 3 levels of permissions. Anyone may create a chatroom, and if they do, they become its owner. In addition, they are able to appoint admins to help run the chatroom. Finally, there are the users, who may make use of the chatroom at any available terminal, but not change anything about the inner functioning. The functions these levels are allowed to use are:

<h5>Owner</h5>

Add Admin
Remove Admin
Delete Chatroom
Transfer Ownership

<h5>Admin</h5>

Add Terminal (requires "Manage Channels" permissions in the server this is attempted)
Remove Terminal
Add User
Remove User
Change User's Name

<h5>User</h5>

Send Messages
Change Own Username
Change Own Profile Picture

--------------------------------------------------------------

<h3>Universal Files</h3>

There are some files that are universally used by the chatroom bot to keep track of information and find things out more efficiently. These files are:

OwnerMapping.json
AdminMapping.json
UserMapping.json
ChannelMapping.json

<h5>OwnerMapping.json</h5>

Maps out a list of chatroom ids to their owner's discord id. Follows the format:
"ownerid": ["chatroomid", "chatroomid", ...],
"ownerid": ["chatroomid", "chatroomid", ...],
...

<h5>AdminMapping.json</h5>

Maps out a list of chatroom ids to an admin's discord id. Follows the format:
"adminid": ["chatroomid", "chatroomid", ...],
"adminid": ["chatroomid", "chatroomid", ...],
...

<h5>UserMapping.json</h5>

Maps out a list of chatroom ids to a user's discord id. Follows the format:
"userid": ["chatroomid", "chatroomid", ...],
"userid": ["chatroomid", "chatroomid", ...],
...

<h5>ChannelMapping.json</h5>

Maps out a chatroom id to a channel's discord id. Follows the format:
"channelid": "chatroomid",
"channelid": "chatroomid",
...

--------------------------------------------------------------

<h3>Chatroom Files</h3>

Each chatroom contains 3 files:

Chatroom.json
Users.json
Log.txt

<h5>Chatroom.json</h5>

Contains the discord user id of the owner of the chatroom, the discord user ids of the admins of the chatroom, and the discord channel ids of the terminals of the chatroom. Follows the format:
"owner": "ownerid",
"admins": ["adminid", "adminid", ...]
"terminals": ["channelid", "channelid", ...]


<h5>Users.json</h5>
Contains the discord user ids of the users of the chatroom, whether they are registered to send messages ("Y"/"N"), their assumed username, and a link to their assumed profile picture. Follows the format:
"userid": ["Y/N", "username", "profile picture link"],
"userid": ["Y/N", "username", "profile picture link"],
...

<h5>Log.txt</h5>

Contains the message and update logs of the entire chatroom. 

Message logs are kept in a single line in the format:
"M"  UserId  Message

Username update logs are kept in a single line in the format:
"UU"  UserId  OldUsername  NewUsername

Profile Picture update logs are kept in a single line in the format:
"PP"  UserId  NewProfilePictureLink