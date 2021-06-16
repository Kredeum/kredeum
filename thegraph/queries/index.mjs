import fetch from "node-fetch";
import fs from "fs";

async function _graphQL(_url, _query) {
  // console.log(`_fetchGQL\n${_url}\n${_query}`);

  let json = {};
  const config = { method: "POST", body: JSON.stringify({ query: _query }) };

  try {
    const res = await fetch(_url, config);
    // console.log(res);
    json = await res.json();
  } catch (e) {
    console.error("_fetchJson ERROR", e, _url, json);
  }
  // console.log(json);
  return json.data;
}

const queryFile = process.argv[2] || "tokens-metadata.gql";
const url = process.argv[3] || "https://api.thegraph.com/subgraphs/name/zapaz/eip721-mumbai";
const query = fs.readFileSync(queryFile, "utf8");

_graphQL(url, query).then((res) => {
  console.log(JSON.stringify(res, null, "  "));
});
