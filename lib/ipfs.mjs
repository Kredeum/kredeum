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

  async pin(buffer, options) {
    return "ipfs.pin is abstract";
  }

  async add(buffer, options) {
    let cid;
    const formData = new FormData();
    formData.append("file", buffer);

    try {
      cid = (
        await (
          await fetch(`${this.endpoint}/api/v0/add`, {
            method: "POST",
            body: formData
          })
        ).json()
      ).Hash;
    } catch (e) {
      console.log("ERROR Ipfs.add", e);
    }
    return cid;
  }

  async pinUrl(url, options) {
    return await this.pin(await (await fetch(url)).blob(), options);
  }

  async addUrl(url, options) {
    return await this.add(await (await fetch(url)).buffer(), options);
  }

  async pinJson(object, options) {
    return await this.pin(this.jsonPrepare(object), options);
  }

  async addJson(object, options) {
    return await this.add(this.jsonPrepare(object), options);
  }
}

export default Ipfs;
