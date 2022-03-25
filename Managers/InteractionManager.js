// @ts-check
const Interaction = require("../Structures/Interaction");
const Collection = require("../Structures/Collection");
const {transformOptions} = require("../Util/transformOptions");

class InteractionManager {
    /** 
    * @param {import('../typings/Managers/CacheManager').Client} client
    */
    constructor(client, data = {}, options = {}) {
        this.client = client;
        this.cache = options.interactions || new Collection();
    }

    forge(data = {}, options = {}) {
        data = transformOptions(data);
        return new Interaction(this.client, data);
    }
}
module.exports = InteractionManager;