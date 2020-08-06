if (Number(process.version.slice(1).split(".")[0]) < 10) throw new Error("Node 10.0.0 or higher is required. Update Node on your system.");
const Discord = require("discord.js")
const DiscordVersion = Discord.version.split(".")[0]
if (DiscordVersion < 11) throw new RangeError("You must install discord.js 11.5.1 or higher!")
if (DiscordVersion > 12) throw new RangeError("You must install discord.js 11.5.1 or higher!")
console.log(`Running discord-friends with version ${DiscordVersion} of discord.js!`);

class discordfriends {
    constructor(client, options) {
        if (!client || !client.token) throw new SyntaxError("You must specify a valid Discord Client!")
        if (!options) options = {};

        this.maxFriends = options.maxFriends || -1;
        this.statusDetection = options.statusDetection || true;
        this.mentionDetection = options.mentionDetection || true;
        this.mentions = options.mentions || true;
        this.friendConnect = options.friendConnect || "one of your friends just connected!";
        this.friendDisconnect = options.friendDisconnect || "one of your friends just disconnected!";
        this.mentionned = options.mentionned || "one of your friends just mention you!";
        this.usersFriends = options.usersFriends || {};
        this.ignoredUsers = options.ignoredUsers || [];
        this.statuses = {}

        if (typeof(this.maxFriends) != "number") throw new TypeError("The option maxFriends must be a number!")
        if (this.maxFriends < -1) throw new TypeError("The option maxFriends must be a number!")
        if (typeof(this.statusDetection) != "boolean") throw new TypeError("The option statusDetection must be a boolean!")
        if (typeof(this.mentionDetection) != "boolean") throw new TypeError("The option mentionDetection must be a boolean!")
        if (typeof(this.mentions) != "boolean") throw new TypeError("The option mentions must be a boolean!")
        if (typeof(this.friendConnect) != "string") throw new TypeError("The option friendConnect must be a string!")
        if (typeof(this.friendDisconnect) != "string") throw new TypeError("The option friendDisconnect must be a string!")
        if (!Array.isArray(this.usersFriends)) throw new TypeError("The option usersFriends must be an Array!")
        if (typeof(this.ignoredUsers) != "object") throw new TypeError("The option ignoredUsers must be an object!")
        Object.values(this.ignoredUsers).forEach(v => {
            if (typeof(v) != "number" && typeof(v) != 'undefined') throw new SyntaxError("The values of the ignoredUsers option must all be valid Discord User ID!")
            if (v.toString().length != 18) throw new SyntaxError("The values of the ignoredUsers option must all be valid Discord User ID!")
        })

        function add (id, friendID, AddFOptions) {
            if (!friendID || id == friendID) throw new SyntaxError("You must specify two different Discord User ID!")
            if (!AddFOptions) AddFOptions = {}
            if (Object.values(this.ignoredUsers).includes(id)) return;
            if (this.usersFriends[friendID].size >= this.maxFriends) return;
            this.usersFriends[friendID].set(id, { "statusDetection":AddFOptions.statusDetection || this.statusDetection, "mentionDetection":AddFOptions.mentionDetection || this.mentionDetection, "mentions":AddFOptions.mentions || this.mentions })
            discordfriends.emit('newFriend', (id, friendID, AddFOptions, this.usersFriends))
        }

        function remove (id, friendID) {
            if (!friendID || id == friendID) throw new SyntaxError("You must specify two different Discord User ID!")
            if (!this.usersFriends[friendID] || this.usersFriends[friendID] == {}) throw new Error("This user-friend pair does not exist!")
            if (Object.values(this.ignoredUsers).includes(id)) return;
            this.usersFriends[friendID].delete(id);
            discordfriends.emit('removeFriend', (id, friendID, this.usersFriends))
        }

        function update (id, friendID, AddFOptions) {
            if (!friendID || id == friendID) throw new SyntaxError("You must specify two different Discord User ID!")
            if (!AddFOptions && AddFOptions != {}) throw new SyntaxError("You must specify an Option List for this user-friend pair!")
            if (!this.usersFriends[friendID] || this.usersFriends[friendID] == {}) throw new Error("This user-friend pair does not exist!")
            if (Object.values(this.ignoredUsers).includes(id)) return;
            if (!this.usersFriends[friendID].has(id)) throw new Error("This user does not have this friend!")
            this.usersFriends[friendID].set(id, { "statusDetection":AddFOptions.statusDetection || this.statusDetection, "mentionDetection":AddFOptions.mentionDetection || this.mentionDetection, "mentions":AddFOptions.mentions || this.mentions })
            discordfriends.emit('updateFriend', (id, friendID, AddFOptions, this.usersFriends))
        }

        function users () {
            if (!this.usersFriends || this.usersFriends == {}) throw new Error("There are no registered user-friend pairs!")
            discordfriends.emit('userListRetrieved', this.usersFriends)
        }

        class clear {
            constructor () {
                if (!this.usersFriends || this.usersFriends == {}) throw new Error("There are no registered user-friend pairs!")
                this.usersFriends = {}
                discordfriends.emit('cleared', this.usersFriends)
            }
        }

        if (DiscordVersion == 11) {
            let bot = new Discord.Client()
            bot.login(client.token)

            bot.on('presenceUpdate', (oldmember, newmember) => {
                if (!this.usersFriends[newmember.id]) return;
                if (!this.statuses[newmember.id]) this.statuses[newmember.id] = "offline"
                if ((newmember.user.precense.status == "online" || newmember.user.precense.status == "idle" || newmember.user.precense.status == "dnd") && this.statuses[newmember.id] == "offline") {
                    for (var [key, value] of this.usersFriends[newmember.id]) {
                        let user = bot.users.find(u => u.id == key)
                        if (!user) return
                        if (this.usersFriends[newmember.id].value[this.mentions]) return user.send(`<@${user.id}>, ${this.friendConnect}`)
                        user.send(this.friendConnect)
                    }
                    this.statuses[newmember.id] = "online"
                } else {
                    for (var [key, value] of this.usersFriends[newmember.id]) {
                        let user = bot.users.find(u => u.id == key)
                        if (!user) return
                        if (this.usersFriends[newmember.id].value[this.mentions]) return user.send(`<@${user.id}>, ${this.friendDisconnect}`)
                        user.send(this.friendDisconnect)
                    }
                    this.statuses[newmember.id] = "offline"
                }
            })
            
            bot.on('message', msg => {
                if (!this.mentionDetection) return;
                msg.mentions.users.forEach(m => {
                    for (var [key, value] of this.usersFriends[m.id]) {
                        let user = bot.users.find(u => u.id == key)
                        if (msg.author.id != key) return
                        var MentionMsg = this.usersFriends[newmember.id].value[this.mentionned] || this.mentionned
                        if (this.usersFriends[newmember.id].value[this.mentions]) return user.send(`<@${user.id}>, ${MentionMsg}`)
                        user.send(MentionMsg)
                    }
                })
            })
        }

        if (DiscordVersion == 12) {
            let bot = new Discord.Client()
            bot.login(client.token)

            bot.on('presenceUpdate', (oldmember, newmember) => {
                if (!this.usersFriends[newmember.id]) return;
                if (!this.statuses[newmember.id]) this.statuses[newmember.id] = "offline"
                if ((newmember.user.precense.status == "online" || newmember.user.precense.status == "idle" || newmember.user.precense.status == "dnd") && this.statuses[newmember.id] == "offline") {
                    for (var [key, value] of this.usersFriends[newmember.id]) {
                        let user = bot.users.cache.find(u => u.id == key)
                        if (!user) return
                        if (this.usersFriends[newmember.id].value[this.mentions]) return user.send(`<@${user.id}>, ${this.friendConnect}`)
                        user.send(this.friendConnect)
                    }
                    this.statuses[newmember.id] = "online"
                } else {
                    for (var [key, value] of this.usersFriends[newmember.id]) {
                        let user = bot.users.cache.find(u => u.id == key)
                        if (!user) return
                        if (this.usersFriends[newmember.id].value[this.mentions]) return user.send(`<@${user.id}>, ${this.friendDisconnect}`)
                        user.send(this.friendDisconnect)
                    }
                    this.statuses[newmember.id] = "offline"
                }
            })
            
            bot.on('message', msg => {
                if (!this.mentionDetection) return;
                msg.mentions.users.forEach(m => {
                    for (var [key, value] of this.usersFriends[m.id]) {
                        let user = bot.users.find(u => u.id == key)
                        if (msg.author.id != key) return
                        var MentionMsg = this.usersFriends[newmember.id].value[this.mentionned] || this.mentionned
                        if (this.usersFriends[newmember.id].value[this.mentions]) return user.send(`<@${user.id}>, ${MentionMsg}`)
                        user.send(MentionMsg)
                    }
                })
            })
        }
    }
}

module.exports = discordfriends