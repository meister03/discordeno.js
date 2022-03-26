// @ts-check
const Guild = require("../Structures/Guild");
const { transformOptions } = require("../Util/transformOptions");

class Guilds {
  /** 
    * @param {import('../typings/Managers/CacheManager').Client} client
    */
  constructor(client, data = {}, options = {}) {
    this.client = client;
    this.cache = options.cache;
  }

  forge(data = {}) {
    data = transformOptions(data);

    if (typeof data.id === "string") data.id = BigInt(data.id);
    if (this.client.guilds.cache?.has(data.id)) {
      const v = this.client.guilds.cache?._get(data.id);
      const members = v.members;
      const channels = v.channels;
      const roles = v.roles;
      const emojis = v.emojis;
      return new Guild(this.client, v, { roles: roles, channels: channels, members: members, emojis: emojis });
    }
    return new Guild(this.client, data, { roles: data.roles, channels: data.channels, members: data.members, emojis: data.emojis });
  }

  async fetch(options = {}) {
    options = transformOptions(options);
    const guild = await this.client.helpers.getGuild(options.id, options);
    return this.forge(guild);
  }
}
module.exports = Guilds;
