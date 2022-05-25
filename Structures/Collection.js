// @ts-check
const Discord = require('discordeno');
class Collection extends Discord.Collection{
    constructor(options = {}){
        super(null, options);
        this.convertKey = options.convertKey ?? false;
    }

    has(key){
        if(typeof key === 'string' && this.convertKey) key = BigInt(key);
        return super.has(key);
    }

    get(key){
        if(typeof key === 'string' && this.convertKey) key = BigInt(key);
        return super.get(key);
    }

    set(key, value, options){
        if(typeof key === 'string' && this.convertKey) key = BigInt(key);
        if(options?.forceSet) return super.forceSet(key, value);
        return super.set(key, value);
    }

    delete(key){
        if(typeof key === 'string' && this.convertKey) key = BigInt(key);
        return super.delete(key);
    }

    first(){
        return super.get([...super.keys()][0]);
    }

    last(){
        return super.get([...super.keys()][super.size - 1]);
    }
}
module.exports = Collection;
