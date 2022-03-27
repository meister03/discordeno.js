// @ts-check
const Channel = require("../Structures/Channel");
const Collection = require("../Structures/Collection");
const { transformOptions } = require("../Util/transformOptions");

class ChannelManager {
  /** 
   * Creates the GuildChannelManager for the Guild.
   * @param {import('../typings/Managers/CacheManager').Client} client Discordeno.js Client
   * @param {import('discordeno').Channel|{}} data Discordeno Channel Data
   * @param {import('../typings/Managers/ChannelManager').Options} options Options for the ChannelManager
   */
  constructor(client, data = {}, options = {}) {
    this.client = client;
    this.cache = options.channels || new Collection();

    if (options.guild) this.guild = options.guild;
  }

  /**
  * Creates a GuildChannel of a given type[number]
  * @param {import('../typings/Structures/Channel').createChannelData} options The options to create the GuildChannel with
  * @param {string|undefined} reason The reason of the channel creation
  * @return {Promise<import('../typings/Structures/Channel').Channel>} Channel Instance
  * @example
  *  const channel = await client.channels.create({name: "test"}, "I like this new channel");
  *     
  */
  async create(options, reason) {
    if (!options.guildId) options.guildId = this.guild?.id;
    return new Channel(this.client, options).create(options, reason);
  }

  /**
  * Edits a existing GuildChannel
  * @param {import('../typings/Structures/Channel').editChannelData} options The options to edit the GuildChannel with
  * @param {string|undefined} reason The reason for editing the channel  
  * @return {Promise<import('../typings/Structures/Channel').Channel>} Channel Instance
  * @example
  *  const channel = await client.channels.edit({id: '123', name: "test"}, "I am changing the name");
  *     
  */
  async edit(options, reason) {
    if (!options.guildId) options.guildId = this.guild?.id;
    return this.forge(options, { guild: this.guild }).edit(options, reason);
  }

  /**
  * Deletes a existing GuildChannel
  * @param {import('../typings/Structures/Channel').deleteChannelData|undefined} options The options for deleting the GuildChannel with
  * @return {Promise<Boolean>} Whether the channel deleted successfully
  * @example
  *  const channel = await client.channels.delete({id: '123'}, "I don't like this channel anymore");
  *     
  */
  async delete(options) {
    options = transformOptions(options);
    return new Channel(this.client, { id: options.id }).delete(options.reason);
  }

  /**
  * Fetches a existing GuildChannel or all guild channels
  * @param {import('../typings/Structures/Channel').fetchChannelData} options The options for fetching
  * @return {Promise<import('../typings/Structures/Channel').Channel|Map<import('../typings/Structures/Channel').Channel>>} Channel Instance
  * @example
  *  const channels = await client.channels.fetch({guildId: '456'});
  *  const channel  = await client.channels.fetch({id: '123'}); 
  */
  async fetch(options) {
    options = transformOptions(options);

    const guildId = options.guildId || this.guild?.id;
    const channelId = options.id;


    if (!channelId) {
      const rawChannels = await this.client.helpers.getChannels(guildId);
      const channels = new Collection();
      for (const channel of rawChannels) {
        channels.set(channel[0], this.forge(channel[1], { guild: this.guild }));
      }
      return channels;
    }

    if (this.cache?.has(channelId)) {
      return this.cache.get(channelId, { guild: this.guild });
    }
    const channel = await this.client.helpers.getChannel(channelId);

    return this.forge(channel, { guild: this })
  }

  /**
  * Transforms a Discordeno Channel in a Class with functions
  * @param {import('../typings/Structures/Channel').ChannelData|import('../typings/Structures/Channel').editChannelData} data The options to transform with
  * @param {import('../typings/Managers/ChannelManager').Options} options The reason for editing the channel  
  * @return {import('../typings/Structures/Channel').Channel} Channel Instance
  * @example
  *  const channel = await client.channels.forge({id: '123', name: "test"});
  *     
  */
  forge(data, options = {}) {
    data = transformOptions(data);

    if (options.guild) {
      if (options.guild.channels.cache?.has(data.id)) {
        return options.guild.channels.cache.get(data.id, { guild: options.guild });
      }
    } else if (this.client.channels.cache?.has(data.id)) {
      return this.client.channels.cache.get(data.id, { guild: options.guild });
    }
    return new Channel(this.client, data, { guild: options.guild });
  }

  forgeManager(data = {}, options = {}) {
    return new ChannelManager(this.client, data, { guild: options.guild, channels: options.channels });
  }
}
module.exports = ChannelManager;
