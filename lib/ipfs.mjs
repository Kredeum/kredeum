class ipfs {
  _key = null;

  get key() {
    return this._key;
  }

  constructor(key) {
    this._key = key;
  }

  jsonPrepare = (object) => JSON.stringify(object, null, 2);
  urlGet = async (url) => (await fetch(url)).blob();

  async pin(buffer, options) {
    return "ipfs.pin is abstract";
  }

  async add(buffer, options) {
    return "ipfs.add is abstract";
  }

  async pinUrl(url, options) {
    return await this.pin(await this.urlGet(url), options);
  }

  async pinJson(object, options) {
    return await this.pin(this.jsonPrepare(object), options);
  }

  async addJson(object, options) {
    return await this.add(this.jsonPrepare(object), options);
  }

  async addUrl(url, options) {
    return await this.add(await this.urlGet(url), options);
  }
}

export default ipfs;
