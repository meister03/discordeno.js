const DestructObject = require("./DestructObject");
const Permissions = require("./Permissions");
const Collection = require("./Collection");
const {transformOptions} = require("../Util/transformOptions");

class Member extends DestructObject {
  /** 
  * @param {import('../typings/Managers/CacheManager').Client client
  */
  constructor(client, member = {}, options = {}) {
    super(member, { "permissions": true });
    this.client = client;

    if (options.guild) this.guild = options.guild;
    else this.guild = client.guilds.forge({ id: this.guildId });

    if(options.user) member.user = options.user;
    if(!member.user) member.user = { id: this.id };
    ///Hard Coding property check
    if(!member.user.username) member.user.username = this.username;
    if(!member.user.discriminator) member.user.discriminator = this.discriminator;
    if(!member.user.avatar) member.user.avatar = this.avatar;
    if(!member.user.bot) member.user.bot = this.bot;

    this.user = client.users.forge(member.user);

    // Shallow Copy RoleIds befor overwrite
    const roleIds = member.roles.slice(0);
    console.log(roleIds)

    this.roles = client.roles.forgeManager({}, {
      guild: options.guild,
      member: this,
      roles: getRoles(client, roleIds, this.guild),
    });
  }

  get permissions() {
    if (this.id === this.guild.ownerId) return new Permissions(Permissions.ALL).freeze();
    if (!this.roles.cache) return new Permissions(0n).freeze();
    const permissions = [...this.roles.cache.values()].map((role) => role._permissions || 0n);
    return new Permissions(permissions).freeze();
  }

  get manageable(){
    if (this.id === this.guild.ownerId) return false;
    if (this.id === this.client.id) return false;
    if (this.client.id === this.guild.ownerId) return true;
    return new Boolean(this.guild.me.roles.highest > this.roles.highest);
  }

  get kickable(){
    return this.manageable && this.guild.me.permissions.has(Permissions.FLAGS.KICK_MEMBERS);
  }

  get bannable(){
    return this.manageable && this.guild.me.permissions.has(Permissions.FLAGS.BAN_MEMBERS);
  }

  async send(options = {}) {
    options = transformOptions(options, {content: true});
    return this.client.users.forge({ id: this.id }).send(options);
  }

  async fetch(options = {}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const guildId = options.guildId || this.guildId || this.guild?.id;

    const member = await this.client.helpers.getMember(guildId, id);
    return this.client.members.forge(member, {guild: this.guild});
  }

  async kick(options = {}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const guildId = options.guildId || this.guildId || this.guild?.id;
    const reason = options.reason;

    const res = await this.client.helpers.kickMember(guildId, id, reason);
    return this;
  }

  async ban(options = {}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const guildId = options.guildId || this.guildId || this.guild?.id;

    const res = await this.client.helpers.banMember(guildId, id, options);
    return this;
  }

  async unban(options = {}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const guildId = options.guildId || this.guildId || this.guild?.id;
    const res = await this.client.helpers.unbanMember(guildId, id);
    return this;
  }

  async edit(options = {}){
    options = transformOptions(options);

    const id = options.id || this.id;
    const guildId = options.guildId || this.guildId || this.guild?.id;

    const member = await this.client.helpers.editMember(guildId, id, options);
    return this.client.members.forge(member, {guild: this.guild});
  }


}
module.exports = Member;

function getRoles(client, roles, guild) {
  if (!roles) return new Collection();
  console.log(typeof roles, roles)
  const memberRoles = new Collection();
  roles.forEach((m) => {
    const role = client.roles.forge({ id: m }, { guild: guild });
    if (role) memberRoles.set(role.id, role);
  });
  return memberRoles;
}
