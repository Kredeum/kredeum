import type { JsonRpcSigner, TransactionResponse, TransactionReceipt, Log } from "ethers";
import { ethers, ZeroAddress, Interface } from "ethers";

import type { NftType } from "@lib/common/types";

import { ipfsGatewayUrl, explorerTxLog, storageLinkToUrlHttp } from "@lib/common/config";
import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { collectionGetContract } from "@lib/collection/collection-get";

import { nftIpfsImage, nftIpfsJson } from "@lib/nft/storage/nft-ipfs";

import type { IOpenNFTsV0 } from "@soltypes/src/interfaces/IOpenNFTsV0";
import type { IOpenNFTsV1 } from "@soltypes/src/interfaces/IOpenNFTsV1";
import type { IOpenNFTsV2 } from "@soltypes/src/interfaces/IOpenNFTsV2";
import type { IOpenNFTsV3Plus } from "@soltypes/src/interfaces/IOpenNFTsV3Plus";
import type { OpenAutoMarket } from "@soltypes/src/OpenAutoMarket";
import type { OpenNFTsV4 } from "@soltypes/src/OpenNFTsV4";

const _mintTokenID = (txReceipt: TransactionReceipt): string => {
  console.log("txReceipt", txReceipt);
  if (!txReceipt.logs) return "";

  let tokenID = "";

  const abi = ["event Transfer(address indexed from, address indexed to, uint256 indexed tokenID)"];
  const iface = new Interface(abi);

  const evt = iface.getEvent("Transfer");
  const logs = txReceipt.logs.filter((_log) => _log.topics[0] == evt?.topicHash);
  if (logs.length == 0) return "";

  const log: Log = logs[0];
  console.log("log:", log);

  if (log.topics.length < 4) return "";
  console.log("log.topics:", log.topics);

  tokenID = log.topics[3];

  // console.log("tokenID", tokenID);
  return tokenID.toString();
};

const _mintedNft = async (
  chainId: number,
  address: string,
  tokenID: string,
  urlJson: string,
  minterAddress: string
): Promise<NftType> =>
  await nftGetMetadata({
    chainId,
    address,
    tokenID,
    tokenURI: urlJson,
    creator: minterAddress,
    minter: minterAddress,
    owner: minterAddress
  });

// GET minting tx response
const nftMint = async (
  chainId: number,
  address: string,
  tokenURI: string,
  minter: JsonRpcSigner,
  price = 0n
): Promise<TransactionResponse | undefined> => {
  const minterAddress = await minter.getAddress();
  // console.log("nftMint", chainId, address, tokenURI, minterAddress);

  if (!(chainId && address && address != ZeroAddress && tokenURI && minterAddress)) return;

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer)) return;

  let txResp: TransactionResponse | undefined;

  if (collection.supports?.IOpenMarketable) {
    const notMine = collection.owner != (await minter.getAddress());
    const value = collection.open && notMine ? collection.price : 0;

    txResp = await (contract as unknown as OpenAutoMarket)["mint(address,string,uint256,address,uint96)"](
      minterAddress,
      tokenURI,
      price,
      collection.royalty?.account || ZeroAddress,
      collection.royalty?.fee || 0,
      { value, type: 2 }
    );
  } else if (collection.supports?.IOpenNFTsV4) {
    txResp = await (contract as unknown as OpenNFTsV4)["mint(string)"](tokenURI);
  } else if (collection.supports?.IOpenNFTsV3) {
    // console.log("IOpenNFTsV3");
    txResp = await (contract as unknown as IOpenNFTsV3Plus).mintOpenNFT(minterAddress, tokenURI);
  } else if (collection.supports?.IOpenNFTsV2) {
    // console.log("IOpenNFTsV2");
    txResp = await (contract as unknown as IOpenNFTsV2).mintNFT(minterAddress, tokenURI);
  } else if (collection.supports?.IOpenNFTsV1) {
    // console.log("IOpenNFTsV1");
    txResp = await (contract as unknown as IOpenNFTsV1).mintNFT(minterAddress, tokenURI);
  } else if (collection.supports?.IOpenNFTsV0) {
    // console.log("IOpenNFTsV0");
    txResp = await (contract as unknown as IOpenNFTsV0).addUser(minterAddress, tokenURI);
  } else {
    console.error("Not IOpenNFTsVx");
  }

  // else if (collection.supports?.IOpenBound) {
  // OpenBound  = mint(cid) OR claim(tokenId, cid)
  // txResp = await (contract as unknown as IOpenBound).mint(cid);
  // }
  explorerTxLog(chainId, txResp);

  return txResp;
};

// GET minting tx receipt
const nftMint4 = async (
  chainId: number,
  address: string,
  txResponse: TransactionResponse,
  metadataCid: string,
  minter: string
): Promise<NftType | null> => {
  if (!(chainId && address && address != ZeroAddress && txResponse && metadataCid && minter)) return null;

  const txReceipt = await txResponse.wait();
  // console.log("txReceipt", txReceipt);
  if (!txReceipt) return null;

  const tokenID = _mintTokenID(txReceipt);
  // console.log("tokenID", tokenID);
  if (!(Number(tokenID) >= 0)) return null;

  const nft = await _mintedNft(chainId, address, tokenID, storageLinkToUrlHttp(metadataCid), minter);
  // console.log("nftMint4", nft);

  return nft;
};

// GET claiming tx receipt
// similar to mint4
const nftClaim4 = async (
  chainId: number,
  address: string,
  txResponse: TransactionResponse,
  tokenID: string,
  owner: string
): Promise<NftType | null> => {
  if (!(chainId && address && address != ZeroAddress && txResponse && tokenID && owner)) return null;

  // console.log("nftClaim", chainId, address, tokenID, destinationAddress);

  await txResponse.wait();
  // const txReceipt =
  // console.log("txReceipt", txReceipt);

  const nft = await _mintedNft(chainId, address, tokenID, ipfsGatewayUrl(tokenID), owner);
  // console.log("nftClaim4", nft);

  return nft;
};

export { nftIpfsImage, nftIpfsJson, nftMint, nftMint4, nftClaim4 };
