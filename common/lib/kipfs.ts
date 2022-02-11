class Ipfs {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  // eslint-disable-next-line @typescript-eslint/require-await,@typescript-eslint/no-unused-vars
  async pin(buffer: Blob | string, options?: RequestInit): Promise<string> {
    return "Ipfs.pin is abstract";
  }

  async add(buffer: Blob | string, options: RequestInit = {}) {
    type IpfsResponse = { Hash: string };
    let cid = "";
    const formData = new FormData();
    formData.append("file", buffer);
    options.method = "POST";
    options.body = formData;

    try {
      const resp: Response = await fetch(`${this.endpoint}/api/v0/add`, options);
      cid = ((await resp.json()) as IpfsResponse).Hash;
    } catch (e) {
      console.log("ERROR Ipfs.add", e);
    }
    return cid;
  }

  async pinUrl(url: string, options?: RequestInit): Promise<string> {
    return await this.pin(await (await fetch(url)).blob(), options);
  }

  async addUrl(url: string, options?: RequestInit): Promise<string> {
    // node-fetch types has no field buffer on fetch !
    interface ResponsePlus extends Response {
      buffer(): Promise<Blob>;
    }
    const res = (await fetch(url)) as ResponsePlus;
    const buffer = await res.buffer();
    // const buffer = await res.blob();
    return await this.add(buffer, options);
  }

  async pinJson(object: unknown, options?: RequestInit): Promise<string> {
    return await this.pin(this.jsonPrepare(object), options);
  }

  async addJson(object: unknown, options?: RequestInit): Promise<string> {
    return await this.add(this.jsonPrepare(object), options);
  }

  jsonPrepare = (object: unknown): string => JSON.stringify(object, null, 2);
}

export default Ipfs;
