class Ipfs {
  _endpoint;

  get endpoint() {
    return this._endpoint;
  }

  constructor(endpoint: string) {
    this._endpoint = endpoint;
  }

  async pin(buffer: Blob | string, options?: Object) {
    return "Ipfs.pin is abstract";
  }

  async add(buffer: Blob | string, options?: Object) {
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

  async pinUrl(url: string, options?: Object) {
    return await this.pin(await (await fetch(url)).blob(), options);
  }

  async addUrl(url: string, options?: Object) {
    // node-fetch types has no field buffer on fetch
    return await this.add(await ((await fetch(url)) as any).buffer(), options);
  }

  async pinJson(object: Object, options?: Object) {
    return await this.pin(this.jsonPrepare(object), options);
  }

  async addJson(object: Object, options?: Object) {
    return await this.add(this.jsonPrepare(object), options);
  }

  jsonPrepare = (object: Object) => JSON.stringify(object, null, 2);
}

export default Ipfs;
