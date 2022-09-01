// @ts-check
const DestructObject = require("./DestructObject");
const {transformOptions} = require("../Util/transformOptions");
const {SnowFlake} = require("../Util/Util");

class User extends DestructObject {
  /** 
  * @param {import('../typings/Managers/CacheManager').Client} client
  */
  constructor(client, user = {}) {
    super(user);
    this.client = client;
  }

  get tag() {
    return `${this.username}#${this.discriminator}`;
  }

  avatarURL(options = {}) {
    const { format, size } = options;
    return this.client.helpers.getAvatarURL(this.id, this.discriminator, { avatar: this.avatar, format, size });
  }

  async send(options = {}) {
    options = transformOptions(options);
    const channel = await this.client.helpers.getDmChannel(this.id);
    return this.client.helpers.sendMessage(channel.id, options);
  }

  get createdTimestamp() {
    return SnowFlake(this.id).timestamp;
  }
}
module.exports = User;
