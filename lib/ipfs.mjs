class Ipfs {
  _key;
  _endpoint;

  get key() {
    return this._key;
  }

  get endpoint() {
    return this._endpoint;
  }

  constructor(endpoint, key) {
    this._endpoint = endpoint;
    this._key = key;
  }

  jsonPrepare = (object) => JSON.stringify(object, null, 2);
  urlGet = async (url) => (await fetch(url)).buffer();

  async pin(buffer, options) {
    return "ipfs.pin is abstract";
  }

  async add(buffer, options) {
    const formData = new FormData();
    formData.append("file", buffer);

    return (
      await (
        await fetch(`${this.endpoint}/api/v0/add`, {
          method: "POST",
          body: formData
        })
      ).json()
    ).Hash;
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

export default Ipfs;
