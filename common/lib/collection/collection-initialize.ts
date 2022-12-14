import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { explorerTxLog } from "@lib/common/config";
import { resolverGetCount } from "@lib/resolver/resolver-get";

import { collectionGetContract } from "./collection-get";

import { OpenNFTsV4 } from "@soltypes/src/OpenNFTsV4";
import { OpenAutoMarket } from "@soltypes/src/OpenAutoMarket";
import { constants, ethers } from "ethers";

import config from "@config/config.json";

const _getN = async (chainId: number, name: string, symbol: string): Promise<{ _name: string; _symbol: string }> => {
  let n = 0;
  if (!(name && symbol)) n = (await resolverGetCount(chainId)) + 1;

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
  // console.log(
  //   `collectionInitializeOpenNFTsV4 ${chainId} '${address}' '${name}' '${symbol}' '${templateConfig}' ${clonerAddress}`
  // );

  const [template, config] = templateConfig.split("/");
  if (template != "OpenNFTsV4") return;

  const { contract, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer)) return;

  const { _name, _symbol } = await _getN(chainId, name, symbol);
  const options: boolean[] = [config == "generic"];
  const subOptionsBytes = ethers.utils.defaultAbiCoder.encode(
    ["uint256", "address", "uint96", "bool[]"],
    [0, signer, 0, options]
  );
  const optionsBytes = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address", "uint96"],
    [subOptionsBytes, constants.AddressZero, 0]
  );

  const txResp = (await (contract as OpenNFTsV4).initialize(
    _name,
    _symbol,
    clonerAddress,
    optionsBytes
  )) as TransactionResponse;

  explorerTxLog(chainId, txResp);
  yield txResp;
  yield await txResp.wait();
}

async function* collectionInitializeOpenAutoMarket(
  chainId: number,
  address: string,
  name: string,
  symbol: string,
  templateConfig: string
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log(
  //   `collectionInitializeOpenAutoMarket ${chainId} '${address}' '${name}' '${symbol}' '${templateConfig}' ${clonerAddress}`
  // );

  const [template] = templateConfig.split("/");
  if (template != "OpenAutoMarket") return;

  const { contract, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer)) return;

  const subOptionsBytes = ethers.utils.defaultAbiCoder.encode(
    ["uint256", "address", "uint96", "bool[]"],
    [0, signer, 0, [true, true]]
  );
  const optionsBytes = ethers.utils.defaultAbiCoder.encode(
    ["bytes", "address", "uint96"],
    [subOptionsBytes, config.treasury.account, config.treasury.fee]
  );

  const { _name, _symbol } = await _getN(chainId, name, symbol);
  const txResp = (await (contract as OpenAutoMarket).initialize(
    _name,
    _symbol,
    signer,
    optionsBytes
  )) as TransactionResponse;

  explorerTxLog(chainId, txResp);
  yield txResp;
  yield await txResp.wait();
}

// collectionInitializeOpenBound
// txResp = await (contract as unknown as OpenBound).initialize(_name, _symbol, clonerAddress, 1);

export { collectionInitializeOpenNFTsV4, collectionInitializeOpenAutoMarket };
