import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { ethers, BigNumber, Contract } from "ethers";

import type { NftType } from "@lib/common/ktypes";
import type { IOpenMulti } from "@soltypes/contracts/interfaces";
import abiIOpenMulti from "@abis/contracts/interfaces/IOpenMulti.sol/IOpenMulti.json";

import { ipfsGatewayUrl, getExplorer, getOpenMulti, storageLinkToUrlHttp } from "@lib/common/kconfig";
import { nftGetMetadata } from "@lib/nft/knft-get-metadata";
import { collectionGetContract } from "@lib/collection/kcollection-get";

import { nftMint1IpfsImage, nftMint2IpfsJson } from "@lib/nft/knft-mint-ipfs";
import { nftMint1SwarmImage, nftMint2SwarmJson } from "@lib/nft/knft-mint-swarm";

import type { IOpenNFTsV0 } from "@soltypes/contracts/interfaces/IOpenNFTsV0";
import type { IOpenNFTsV1 } from "@soltypes/contracts/interfaces/IOpenNFTsV1";
import type { IOpenNFTsV2 } from "@soltypes/contracts/interfaces/IOpenNFTsV2";
import type { IOpenNFTsV3 } from "@soltypes/contracts/interfaces/IOpenNFTsV3";
import type { OpenNFTsV4 } from "@soltypes/contracts/next/OpenNFTsV4";

const _mintTokenID = (txReceipt: TransactionReceipt): string => {
  let tokenID = "";

  // console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = ["event Transfer(address indexed from, address indexed to, uint256 indexed tokenID);"];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(txReceipt.logs[0]);
    ({ tokenID } = log.args);
  }

  // const tokenID = res.events[0].args[2].toString();
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

const nftMintTexts = [
  "Mint",
  "Wait till Image stored on decentralized storage",
  "Wait till Metadata stored on decentralized storage",
  "Please, sign the transaction",
  "Wait till transaction completed, it may take one minute or more..."
];

// GET minting tx response
const nftMint3TxResponse = async (
  chainId: number,
  address: string,
  tokenURI: string,
  minter: JsonRpcSigner
): Promise<TransactionResponse | undefined> => {
  const minterAddress = await minter.getAddress();
  // console.log("nftMint3TxResponse", chainId, address, tokenURI, minterAddress);

  if (!(chainId && address && tokenURI && minterAddress)) return;

  const { contract, collection } = await collectionGetContract(chainId, address, minter.provider);
  // console.log("nftMint3TxResponse collection", collection);

  let txResp: TransactionResponse | undefined;
  const connectedContract = contract.connect(minter);
  // console.log("connectedContract", connectedContract);

  if (collection.supports?.IOpenNFTsV4) {
    const openNFTsV4 = connectedContract as OpenNFTsV4;
    const defaultPrice = String(await openNFTsV4.defaultPrice());

    if (defaultPrice == "0") {
      txResp = await openNFTsV4["mint(string)"](tokenURI);
    } else {
      // console.log("defaultPrice", defaultPrice);
      const txOptions = {
        value: defaultPrice,
        type: 2
      };
      const minterAddress = await minter.getAddress();
      txResp = await openNFTsV4["mint(address,string,uint256,address,uint96)"](
        minterAddress,
        tokenURI,
        defaultPrice,
        ethers.constants.AddressZero,
        0,
        txOptions
      );
      // console.log("OpenNFTsV4 AFTER");
    }
  } else if (collection.supports?.IOpenNFTsV3) {
    // console.log("IOpenNFTsV3");
    txResp = await (connectedContract as IOpenNFTsV3).mintOpenNFT(minterAddress, tokenURI);
  } else if (collection.supports?.IOpenNFTsV2) {
    // console.log("IOpenNFTsV2");
    txResp = await (connectedContract as IOpenNFTsV2).mintNFT(minterAddress, tokenURI);
  } else if (collection.supports?.IOpenNFTsV1) {
    // console.log("IOpenNFTsV1");
    txResp = await (connectedContract as IOpenNFTsV1).mintNFT(minterAddress, tokenURI);
  } else if (collection.supports?.IOpenNFTsV0) {
    // console.log("IOpenNFTsV0");
    txResp = await (connectedContract as IOpenNFTsV0).addUser(minterAddress, tokenURI);
  } else {
    console.error("Not IOpenNFTsVx");
  }

  // else if (collection.supports?.IOpenBound) {
  // OpenBound  = mint(cid) OR claim(tokenId, cid)
  // txResp = await (contract as IOpenBound).mint(cid);
  // }
  console.info(`${getExplorer(chainId)}/tx/${txResp?.hash || ""}`);

  return txResp;
};

// GET claiming tx response
// similar to mint3
const nftClaim3TxResponse = async (
  chainId: number,
  address: string,
  tokenID: string,
  owner: JsonRpcSigner
): Promise<TransactionResponse | null> => {
  // console.log(`nftClaimResponse ${nftKey(chainId, address, tokenID)}`);
  const openMultiAddress = getOpenMulti(chainId);
  if (!(chainId && address && tokenID && owner && openMultiAddress)) return null;

  const openMulti = new Contract(openMultiAddress, abiIOpenMulti, owner);
  // console.log("openMulti", openMulti);

  const txResp = await (openMulti as IOpenMulti).claim(BigNumber.from(tokenID));
  console.info(`${getExplorer(chainId)}/tx/${txResp?.hash || ""}`);

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
  if (!(chainId && address && txResponse && metadataCid && minter)) return null;

  const txReceipt = await txResponse.wait();
  // console.log("txReceipt", txReceipt);

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
  if (!(chainId && address && txResponse && tokenID && owner)) return null;

  // console.log("nftClaim", chainId, address, tokenID, destinationAddress);

  await txResponse.wait();
  // const txReceipt =
  // console.log("txReceipt", txReceipt);

  const nft = await _mintedNft(chainId, address, tokenID, ipfsGatewayUrl(tokenID), owner);
  // console.log("nftClaim4", nft);

  return nft;
};

export {
  nftMintTexts,
  nftMint1IpfsImage,
  nftMint2IpfsJson,
  nftMint1SwarmImage,
  nftMint2SwarmJson,
  nftMint3TxResponse,
  nftClaim3TxResponse,
  nftMint4,
  nftClaim4
};
