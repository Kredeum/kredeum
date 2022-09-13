import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { explorerTxLog } from "@lib/common/kconfig";
import { resolverGetCount } from "@lib/resolver/resolver-get";

import { collectionGet } from "./kcollection-get";

import { OpenNFTsV4 } from "@soltypes/contracts/next/OpenNFTsV4";
import { OpenAutoMarket } from "@soltypes/contracts/next/OpenAutoMarket";
// import { OpenBound } from "@soltypes/contracts/next/OpenBound";

const _getN = async (
  chainId: number,
  name: string,
  symbol: string,
  cloner: JsonRpcSigner
): Promise<{ _name: string; _symbol: string }> => {
  let n = 0;
  if (!(name && symbol)) n = (await resolverGetCount(chainId, cloner)) + 1;

  const _name = name || `Open AutoMarket #${n}`;
  const _symbol = symbol || `NFT#${n}`;

  return { _name, _symbol };
};

async function* collectionInitializeOpenNFTsV4(
  chainId: number,
  address: string,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  const clonerAddress = await cloner.getAddress();
  console.log(
    `collectionInitializeOpenNFTsV4 ${chainId} '${address}' '${name}' '${symbol}' '${templateConfig}' ${clonerAddress}`
  );

  const [template, config] = templateConfig.split("/");
  if (template != "OpenNFTsV4") return;

  const contract = await collectionGet(chainId, address, cloner);

  const { _name, _symbol } = await _getN(chainId, name, symbol, cloner);
  const options: boolean[] = [config == "generic"];
  const txResp = await (contract as unknown as OpenNFTsV4).initialize(_name, _symbol, clonerAddress, options);

  explorerTxLog(chainId, txResp);
  yield txResp;
  yield await txResp.wait();
}

async function* collectionInitializeOpenAutoMarket(
  chainId: number,
  address: string,
  name: string,
  symbol: string,
  templateConfig: string,
  cloner: JsonRpcSigner
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  const clonerAddress = await cloner.getAddress();
  console.log(
    `collectionInitializeOpenAutoMarket ${chainId} '${address}' '${name}' '${symbol}' '${templateConfig}' ${clonerAddress}`
  );

  const [template, ] = templateConfig.split("/");
  if (template != "OpenAutoMarket") return;

  const contract = await collectionGet(chainId, address, cloner);

  const { _name, _symbol } = await _getN(chainId, name, symbol, cloner);
  const txResp = await (contract as unknown as OpenAutoMarket).initialize(
    _name,
    _symbol,
    clonerAddress,
    0,
    clonerAddress,
    0,
    [false]
  );

  explorerTxLog(chainId, txResp);
  yield txResp;
  yield await txResp.wait();
}

// collectionInitializeOpenBound
// txResp = await (contract as unknown as OpenBound).initialize(_name, _symbol, clonerAddress, 1);

export { collectionInitializeOpenNFTsV4, collectionInitializeOpenAutoMarket };
