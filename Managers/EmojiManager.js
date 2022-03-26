// @ts-check
const Emoji = require("../Structures/Emoji");
const Collection = require("../Structures/Collection");
const {transformOptions} = require("../Util/transformOptions");
class Emojis {
  /** 
    * @param {import('../typings/Managers/CacheManager').Client} client
    */
  constructor(client, data = {}, options = {}) {
    this.client = client;
    this.cache = options.emojis || new Collection();
    if (options.guild) this.guild = options.guild;
  }

  forge(data = {}, options = {}) {
    data = transformOptions(data);
    return new Emoji(this.client, data, { guild: options.guild });
  }

  forgeManager(data = {}, options = {}) {
    return new Emojis(this.client, data, { guild: options.guild, emojis: options.emojis });
  }

  async create(options = {}) {
    if (!options.guildId) options.guildId = this.guild?.id;
    return new Emoji(this.client, options).create(options);
  }

  async edit(options = {}) {
    if (!options.guildId) options.guildId = this.guild?.id;
    return this.forge(options, { guild: this.guild }).edit(options);
  }

  async delete(options = {}) {
    options = transformOptions(options);
    return new Emoji(this.client, { id: options.id }).delete(options);
  }

  async fetch(options = {}){
    options = transformOptions(options);

    const guildId = options.guildId || this.guild?.id;
    const emojiId = options.id;

    if(!emojiId){
      const rawEmojis = await this.client.helpers.getEmojis(guildId);
      const emojis = new Collection();
      for(const emoji of rawEmojis){
        emojis.set(emoji[0], this.forge(emoji[1], {guild: this.guild}));
      }
      return emojis;
    }

    if (this.cache?.has(emojiId)) return this.cache.get(emojiId, { guild: this.guild });
    const emoji = await this.client.helpers.getEmoji(guildId, emojiId);
    return this.forge(emoji, {guild: this.guild});
  }
}
module.exports = Emojis;
