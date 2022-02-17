import { ipfsToUrlHttp } from "./kconfig";

type FetchResponse = {
  data?: unknown;
  error?: unknown;
};

const fetchJson = async (url: string, config: RequestInit = {}): Promise<FetchResponse> => {
  let json: FetchResponse;
  if (url) {
    try {
      // console.log(url, config);
      const res = await fetch(ipfsToUrlHttp(url), config);
      // console.log(res);
      json = (await res.json()) as FetchResponse;
    } catch (e) {
      json = { error: e };
      console.error("OpenNFTs.fetchJson ERROR", e, url, json);
    }
  } else {
    const e = "OpenNFTs.fetchJson URL not defined";
    console.error(e);
    json = { error: e };
  }
  // console.log("fetchJson(", url, config, ") =>", json);
  return json;
};

const fetchGQL = async (url: string, query: string): Promise<unknown> => {
  const config = { method: "POST", body: JSON.stringify({ query: query }) };

  const answerGQL = await fetchJson(url, config);

  if (answerGQL.error) console.error("fetchGQL ERROR", answerGQL.error);
  return answerGQL?.data;
};

const fetchCov = async (path: string): Promise<unknown> => {
  const loginPass = `${process.env.COVALENT_API_KEY}`;
  const url = `https://api.covalenthq.com/v1${path}&key=${loginPass}`;
  const config = {
    method: "GET",
    headers: {
      // Authorization: `Basic ${btoa(loginPass)}`,
      Accept: "application/json"
    }
  };

  const answerCov: FetchResponse = await fetchJson(url, config);

  if (answerCov.error) console.error("fetchCov ERROR", answerCov.error);
  return answerCov?.data;
};

export { fetchJson, fetchGQL, fetchCov };
