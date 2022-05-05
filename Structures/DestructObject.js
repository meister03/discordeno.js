// @ts-check
class DestructObject {
  constructor(message = {}, removeFields = {}) {
    this._raw = message;
    this.destructObject(message, removeFields);
  }
  destructObject(message, removeFields) {
    for (let [key, value] of Object.entries(message)) {
      if (!removeFields[key]) {
        this[key] = value;
        // Add toggles to base level
        if(key === 'toggles') {
          for (let [toggleKey, toggleValue] of Object.entries(this[key].list())) {
            this[toggleKey] = toggleValue;
          }
        }
      } else {
        this[`_${key}`] = value;
      }
    }
    return this;
  }

  toJSON() {
    return this._raw;
  }
}
module.exports = DestructObject;
