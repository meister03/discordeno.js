const Discord = require('discordeno');
const User = require('./User');
const { ACTIVITIES } = require('../Util/Constants');
const { transformApplicationCommand } = require('../Util/transformOptions');
class Client extends Discord.createBot {
    constructor(options = {}) {
        super(options);
        this.user = new User(this, { id: options.botId });
        this._setActivity = async (content, activities) => {
            const status = activities.status;
            activities = [activities];
            const ddOptions = {
                status: status || 'online',
                activities: activities.map(activity => {
                    return {
                        type: ACTIVITIES[activity.type.toUpperCase()],
                        name: content,
                        url: activity.url,
                        applicationId: this.user.id,
                    }
                })
            };
            return await this.helpers.editBotStatus(ddOptions);
        };

        this._setApplicationCommands = async (commands, guildId, commandId) => {
            if(typeof commands === 'object'){
                return await this.helpers.upsertApplicationCommands(commandId, transformApplicationCommand(commands), guildId);
            }
            const ddCommands = [];
            commands.forEach(x => ddCommands.push(transformApplicationCommand(x)));
            return await this.helpers.upsertApplicationCommands(ddCommands, guildId, commandId);
        }

        this.patchMe = (options = {}) => {
            this.user = new User(this, options);
            this.user.setActivity = this._setActivity;
            // @todo create application class
            this.application = { commands: { cache: { set: this._setApplicationCommands } } };
            return this.user;
        }
    }
}
module.exports = Client;