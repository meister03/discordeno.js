// @ts-check
const Member = require("../Structures/Member");
const Collection = require("../Structures/Collection");
const {transformOptions} = require("../Util/transformOptions");
const {shardIdForGuildId} = require("../Util/Util");
class Members {
  /** 
    * @param {import('../typings/Managers/CacheManager').Client} client
    */
  constructor(client, data = {}, options = {}) {
    this.client = client;

    this.cache = options.members || new Collection();
    if (options.guild) this.guild = options.guild;
  }

  forge(data = {}, options = {}) {
    data = transformOptions(data);
    if (options.guild && data.id) {
      if (options.guild.members.cache?.has(data.id)) {
        const user = this.client.users.cache._get(data.id);
        return options.guild.members.cache.get(data.id, { guild: options.guild, user });
      }
    }
    return new Member(this.client, data, { guild: options.guild, user: options.user });
  }

  forgeManager(data = {}, options = {}) {
    return new Members(this.client, data, { guild: options.guild, members: options.members });
  }

  async fetch(options = {}) {
    options = transformOptions(options);
    const guildId = options.guildId || this.guild?.id;
    const shardId = options.shardId || shardIdForGuildId(guildId, this.client.gateway.manager.totalShards);
    const memberId = options.id;

    if(!memberId){
      const rawMembers = await this.client.helpers.fetchMembers(guildId, shardId, options);
      const members = new Collection();
      // rawMembers not Collection, because of Custom Overwrite in CacheManager
      for(const member of rawMembers){
        members.set(member.id, this.forge(member, {guild: this.guild}));
      }
      return members;
    }

    if (this.cache?.has(memberId)) return this.forge(memberId, { guild: this.guild });
    const member = await this.client.helpers.getMember(guildId, memberId);
    return this.forge(member, { guild: this.guild, user: member.user });
  }

  async edit(options = {}) {
    options = transformOptions(options);
    const member = this.forge(options, { guild: this.guild });
    return member.edit(options);
  }

  async kick(options = {}) {
    options = transformOptions(options);
    const member = this.forge(options, { guild: this.guild });
    return member.kick(options);
  }

  async ban(options = {}) {
    options = transformOptions(options);
    const member = this.forge(options, { guild: this.guild });
    return member.ban(options);
  }

  async unban(options = {}) {
    options = transformOptions(options);
    const member = this.forge(options, { guild: this.guild });
    return member.unban(options);
  }
}
module.exports = Members;
