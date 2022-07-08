import { storageLinkToUrlHttp, getSubgraphUrl, getAlchemyUrl } from "lib/kconfig";

type FetchResponse = {
  data?: unknown;
  error?: unknown;
};

const fetchJson = async (url: string, config: RequestInit = {}): Promise<FetchResponse> => {
  let json: FetchResponse;
  if (url) {
    try {
      // console.log(url, config);
      const res = await fetch(storageLinkToUrlHttp(url), config);
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

const fetchGQL = async (chainId: number, query: string): Promise<unknown> => {
  const config = { method: "POST", body: JSON.stringify({ query: query }) };

  const answerGQL = await fetchJson(getSubgraphUrl(chainId), config);

  if (answerGQL.error) console.error("fetchGQL ERROR", answerGQL.error);
  return answerGQL?.data;
};

const fetchCov = async (path: string): Promise<unknown> => {
  const loginPass = `${process.env.COVALENT_API_KEY || ""}`;
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

const fetchAlch = async (chainId: number, path: string): Promise<unknown> => {
  let alchemyKey = "";
  const alchemyUrl = getAlchemyUrl(chainId);

  if (chainId === 1) alchemyKey = `${process.env.ALCHEMY_API_KEY || ""}`;
  else if (chainId === 137) alchemyKey = `${process.env.ALCHEMY_API_KEY_POLYGON || ""}`;

  if (!(chainId && alchemyUrl && alchemyKey && path)) return;

  const url = `${alchemyUrl}/${alchemyKey}${path}`;
  // console.log("fetchAlch ~ url", url);
  const config = {
    method: "GET",
    headers: { Accept: "application/json" }
  };

  const answerAlch: FetchResponse = await fetchJson(url, config);
  // console.log("fetchAlch ~ answerAlch", answerAlch);

  if (answerAlch.error) console.error("fetchCov ERROR", answerAlch.error);
  return answerAlch;
};

export { fetchJson, fetchGQL, fetchCov, fetchAlch };
