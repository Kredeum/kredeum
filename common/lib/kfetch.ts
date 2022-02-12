type FetchResponse = {
  data?: unknown;
  error?: unknown;
};

const fetchJson = async (_url: string, _config: RequestInit = {}): Promise<FetchResponse> => {
  let json: FetchResponse;
  if (_url) {
    try {
      // console.log(_url, _config);
      const res = await fetch(_url, _config);
      // console.log(res);
      json = (await res.json()) as FetchResponse;
    } catch (e) {
      json = { error: e };
      console.error("OpenNFTs.fetchJson ERROR", e, _url, json);
    }
  } else {
    const e = "OpenNFTs.fetchJson URL not defined";
    console.error(e);
    json = { error: e };
  }
  // console.log("fetchJson(", _url, _config, ") =>", json);
  return json;
};

const fetchGQL = async (_url: string, _query: string): Promise<unknown> => {
  const config = { method: "POST", body: JSON.stringify({ query: _query }) };

  const answerGQL = await fetchJson(_url, config);

  if (answerGQL.error) console.error("fetchGQL ERROR", answerGQL.error);
  return answerGQL?.data;
};

const fetchCov = async (_path: string): Promise<unknown> => {
  const loginPass = `${process.env.COVALENT_API_KEY}`;
  const url = `https://api.covalenthq.com/v1${_path}&key=${loginPass}`;
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
