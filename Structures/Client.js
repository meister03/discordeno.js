const Discord = require('discordeno');
const User = require('./User');
const { ACTIVITIES } = require('../Util/Constants');
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
        this.patchMe = (options = {}) => {
            this.user = new User(this, options);
            this.user.setActivity = this._setActivity;
            return this.user;
        }
    }
}
module.exports = Client;