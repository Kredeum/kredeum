class pin {
  _key = null;

  get key() {
    return this._key;
  }

  constructor(key) {
    this._key = key;
  }

  async pin(buffer, options) {
    return "pin class is abstract";
  }

  async pinUrl(url, options) {
    return await this.pin(await (await fetch(url)).blob(), options);
  }

  async pinJson(object, options) {
    return await this.pin(JSON.stringify(object, null, 2), options);
  }
}

export default pin;
