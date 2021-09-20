type AnswerFetchJson = {
  data?: any;
  error?: any;
};

async function fetchJson(_url: string, _config: Object = {}): Promise<AnswerFetchJson> {
  let json: AnswerFetchJson = {};
  if (_url) {
    try {
      const res = await fetch(_url, _config);
      // console.log(res);
      json = await res.json();
    } catch (e) {
      console.error("OpenNFTs.fetchJson ERROR", e, _url, json);
      json = { error: e };
    }
  } else {
    const e = "OpenNFTs.fetchJson URL not defined";
    console.error(e);
    json = { error: e };
  }
  // console.log("fetchJson(", _url, _config, ") =>", json);
  return json;
}

async function fetchGQL(_url: string, _query: string) {
  // console.log(`OpenNFTs.fetchGQL\n${_url}\n${_query}`);

  const config = { method: "POST", body: JSON.stringify({ query: _query }) };
  const answerGQL = (await fetchJson(_url, config)) as AnswerFetchJson;
  // console.log(answerGQL);

  if (answerGQL.error) console.error("OpenNFTs.fetchGQL ERROR", answerGQL.error);
  return answerGQL.data;
}

async function fetchCov(_path: string) {
  const loginPass = `${process.env.COVALENT_API_KEY}:`;
  const url = `https://api.covalenthq.com/v1${_path}&key=${loginPass}`;
  const config = {
    method: "GET",
    headers: {
      Authorization: `Basic ${btoa(loginPass)}`,
      Accept: "application/json"
    }
  };
  const json: AnswerFetchJson = await fetchJson(url, config);
  // console.log(url, "\n", json);
  return json;
}

export { fetchJson, fetchGQL, fetchCov };
