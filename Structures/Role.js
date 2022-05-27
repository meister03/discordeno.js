// @ts-check
const DestructObject = require("./DestructObject");
const Permissions = require("./Permissions");
const { convertColor } = require("../Util/Util");

class Role extends DestructObject {
  /** 
 * @param {import('../typings/Managers/CacheManager').Client} client
 */
  constructor(client, role = {}, options = {}) {
    super(role, { "permissions": true });
    console.log(options.guild?.name, client.guilds.forge({ id: role.guildId })?.name)
    if (options.guild) this.guild = options.guild;
    else this.guild = client.guilds.forge({ id: role.guildId });
    this.client = client;
  }

  get permissions() {
    return new Permissions(this._permissions || 0n).freeze();
  }

  async delete(options) {
    const guildId = this.guildId || this.guilld?.id;
    const res = await this.client.helpers.deleteRole(guildId, this.id);
    return true;
  }

  async create(options = {}, reason) {
    const guildId = this.guildId || this.guild?.id;
    if (options.color) options.color = convertColor(options.color);
    const role = await this.client.helpers.createRole(guildId, options, reason);
    return this.client.roles.forge(role, { guild: this.guild });
  }

  async edit(options) {
    const guildId = this.guildId || this.guild?.id;
    if (options.color) options.color = convertColor(options.color);
    const role = await this.client.helpers.editRole(guildId, this.id, options);
    return this.client.roles.forge(role, { guild: this.guild });
  }

  async setPosition(position){
    const guildId = this.guildId || this.guild?.id;
    const roles = await this.client.helpers.modifyRolePositions(guildId, [{id: this.id, position}]);
    return roles.map(x => this.client.roles.forge(x, { guild: this.guild }));
  }

}
module.exports = Role;
