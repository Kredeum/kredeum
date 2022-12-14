import { storageLinkToUrlHttp } from "@lib/common/config";

const FETCH_LIMIT = 10;

type FetchResponse = {
  data?: unknown;
  error?: unknown;
};

const _fetchJson = async (url: string, config: RequestInit = {}): Promise<FetchResponse> => {
  let json: FetchResponse;
  if (url) {
    try {
      // console.log("_fetchJson", url, config);
      const res = await fetch(url, config);
      // console.log("_fetchJson", res);

      json = (await res.json()) as FetchResponse;
    } catch (e) {
      json = { error: e };
      console.error("fetchJson ERROR", e, url, config);
    }
  } else {
    const e = "fetchJson URL not defined";
    console.error(e);
    json = { error: e };
  }
  // console.log("fetchJson(", url, config, ") =>", json);
  return json;
};

// TODO rename to fetchIpfsJson , and call it when ipfs...
const fetchJson = async (url: string, config: RequestInit = {}): Promise<FetchResponse> =>
  await _fetchJson(storageLinkToUrlHttp(url), config);

const fetchGQL = async (url: string, query: string): Promise<unknown> => {
  const config = {
    method: "POST",
    body: JSON.stringify({ query: query }),
    headers: { Accept: "application/json" }
  };

  const answerGQL = await _fetchJson(url, config);

  if (answerGQL.error) console.error("fetchGQL ERROR", answerGQL.error);
  return answerGQL?.data;
};

export type { FetchResponse };
export { fetchJson, fetchGQL, FETCH_LIMIT };
