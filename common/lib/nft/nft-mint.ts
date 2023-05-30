import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import type { BigNumberish, PayableOverrides } from "ethers";
import { ethers, constants } from "ethers";

import type { NftType } from "@lib/common/types";

import { explorerTxLog, isEip1559 } from "@lib/common/config";
import { nftGetMetadata } from "@lib/nft/nft-get-metadata";
import { collectionGetContract } from "@lib/collection/collection-get";

import type { IOpenNFTsV0 } from "@soltypes/IOpenNFTsV0";
import type { IOpenNFTsV1 } from "@soltypes/IOpenNFTsV1";
import type { IOpenNFTsV2 } from "@soltypes/IOpenNFTsV2";
import type { IOpenNFTsV3Plus } from "@soltypes/IOpenNFTsV3Plus";
import type { OpenAutoMarket } from "@soltypes/OpenAutoMarket";
import type { OpenNFTsV4 } from "@soltypes/OpenNFTsV4";
import {
  collectionIsOpenMarketable,
  collectionRoyaltyAccount,
  collectionRoyaltyFee,
  collectionSupports
} from "@lib/collection/collection";
import { storageLinkToUrlHttp } from "./storage/storage";
import { ipfsGatewayUrl } from "./storage/ipfs";

const _mintTokenID = (txReceipt: TransactionReceipt): string => {
  let tokenID = "";

  // console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = ["event Transfer(address indexed from, address indexed to, uint256 indexed tokenID)"];
    const iface = new ethers.utils.Interface(abi);

    const eventTopic = iface.getEventTopic("Transfer");
    const logs = txReceipt.logs.filter((_log) => _log.topics[0] == eventTopic);

    if (logs.length == 0) {
      console.error("ERROR no topics", txReceipt);
    } else {
      const log = iface.parseLog(logs[0]);
      tokenID = log.args[2] as string;
    }
  }

  // console.log("tokenID", tokenID);
  return tokenID.toString();
};

const _mintedNft = async (
  chainId: number,
  address: string,
  tokenID: string,
  urlJson: string,
  minter: string
): Promise<NftType> =>
  await nftGetMetadata({
    chainId,
    address,
    tokenID,
    tokenURI: urlJson,
    creator: minter,
    minter: minter,
    owner: minter
  });

// GET minting tx response
const nftMint = async (
  chainId: number,
  address: string,
  tokenURI: string,
  minter: string,
  price: BigNumberish = 0
): Promise<TransactionResponse | undefined> => {
  // console.log("nftMint", chainId, address, tokenURI, minter);

  if (!(chainId && address && address != constants.AddressZero && tokenURI && minter)) return;

  const { contract, collection, signer } = await collectionGetContract(chainId, address, true);
  if (!(contract && signer === minter)) return;

  let txResp: TransactionResponse | undefined;

  if (collectionIsOpenMarketable(collection)) {
    const notMine = collection.owner != minter;
    const value = collection.open && notMine ? collection.price : 0;
    const overrides: PayableOverrides = { value };
    if (isEip1559(chainId)) overrides.type = 2;

    txResp = await (contract as OpenAutoMarket)["mint(address,string,uint256,address,uint96)"](
      minter,
      tokenURI,
      price,
      collectionRoyaltyAccount(collection),
      collectionRoyaltyFee(collection),
      overrides
    );
  } else if (collectionSupports(collection).get("IOpenNFTsV4")) {
    txResp = await (contract as OpenNFTsV4)["mint(string)"](tokenURI);
  } else if (collectionSupports(collection).get("IOpenNFTsV3")) {
    // console.log("IOpenNFTsV3");
    txResp = await (contract as IOpenNFTsV3Plus).mintOpenNFT(minter, tokenURI);
  } else if (collectionSupports(collection).get("IOpenNFTsV2")) {
    // console.log("IOpenNFTsV2");
    txResp = await (contract as IOpenNFTsV2).mintNFT(minter, tokenURI);
  } else if (collectionSupports(collection).get("IOpenNFTsV1")) {
    // console.log("IOpenNFTsV1");
    txResp = await (contract as IOpenNFTsV1).mintNFT(minter, tokenURI);
  } else if (collectionSupports(collection).get("IOpenNFTsV0")) {
    // console.log("IOpenNFTsV0");
    txResp = await (contract as IOpenNFTsV0).addUser(minter, tokenURI);
  } else {
    console.error("Not IOpenNFTsVx");
  }

  // else if (collectionSupports(collection).get("IOpenBound")) {
  // OpenBound  = mint(cid) OR claim(tokenId, cid)
  // txResp = await (contract as IOpenBound).mint(cid);
  // }
  explorerTxLog(chainId, txResp);

  return txResp;
};

// GET minting tx receipt
const nftMinted = async (
  chainId: number,
  address: string,
  txResponse: TransactionResponse,
  metadataCid: string,
  minter: string
): Promise<NftType | null> => {
  if (!(chainId && address && address != constants.AddressZero && txResponse && metadataCid && minter)) return null;

  const txReceipt = await txResponse.wait();
  // console.log("txReceipt", txReceipt);

  const tokenID = _mintTokenID(txReceipt);
  // console.log("tokenID", tokenID);

  if (!(Number(tokenID) >= 0)) return null;

  const nft = await _mintedNft(chainId, address, tokenID, storageLinkToUrlHttp(metadataCid), minter);
  // console.log("nftMinted", nft);

  return nft;
};

// GET claiming tx receipt
// similar to mint4
const nftClaimed = async (
  chainId: number,
  address: string,
  txResponse: TransactionResponse,
  tokenID: string,
  owner: string
): Promise<NftType | null> => {
  if (!(chainId && address && address != constants.AddressZero && txResponse && tokenID && owner)) return null;

  // console.log("nftClaim", chainId, address, tokenID, destinationAddress);

  await txResponse.wait();
  // const txReceipt =
  // console.log("txReceipt", txReceipt);

  const nft = await _mintedNft(chainId, address, tokenID, ipfsGatewayUrl(tokenID), owner);
  // console.log("nftClaimed", nft);

  return nft;
};

export { nftMint, nftMinted, nftClaimed };
