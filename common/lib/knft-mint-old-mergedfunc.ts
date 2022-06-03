import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { ethers } from "ethers";
import NftStorage from "./knft-storage";

import type { NftType } from "./ktypes";
import { ipfsGatewayUrl, swarmGatewayUrl, textShort, getNetwork, DEFAULT_NAME } from "./kconfig";
import { nftGetMetadata } from "./knft-get-metadata";
import { collectionContractGet } from "./kcollection-get";

import { swarmUploadFile } from "./kbeejs";

let nftStorage: NftStorage;

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
  "Wait till Image stored on IPFS",
  "Wait till Metadata stored on IPFS",
  "Please, sign the transaction",
  "Wait till transaction completed, it may take one minute or more..."
];

const nftSwarmMintTexts = [
  "Mint",
  "Wait till Image stored on Swarm",
  "Wait till Metadata stored on Swarm",
  "Please, sign the transaction",
  "Wait till transaction completed, it may take one minute or more..."
];

// GET ipfs image link
const nftMint1IpfsImage = async (image: string, key = ""): Promise<string> => {
  nftStorage = nftStorage || new NftStorage(key);
  const ipfsImage = `ipfs://${await nftStorage.pinUrl(image)}`;

  // console.log("nftMint ipfs image", ipfsImage);
  return ipfsImage;
};

// GET ipfs metadata url
const nftMint2IpfsJson = async (
  name = DEFAULT_NAME,
  ipfs = "",
  address = "",
  image = "",
  metadata = "{}"
): Promise<string> => {
  // console.log("nftMint2IpfsJson", name, ipfs, address, image, metadata);

  if (ipfs.startsWith("ipfs://")) {
    const json = {
      name,
      description: name || "",
      image: ipfsGatewayUrl(ipfs),
      ipfs,
      origin: textShort(image, 140),
      minter: address
    } as NftType;
    if (metadata) json.metadata = JSON.parse(metadata);

    const ipfsCid = await nftStorage.pinJson(json);
    const ipfsJson = `ipfs://${ipfsCid}`;

    return ipfsJson;
  } else {
    const json = {
      name,
      description: name || "",
      image: swarmGatewayUrl(ipfs),
      ipfs,
      origin: textShort(image, 140),
      minter: address
    } as NftType;
    if (metadata) json.metadata = JSON.parse(metadata);

    const ipfsJson: string = await swarmUploadFile(JSON.stringify(json, null, 2), "swarmJson", "text");

    return ipfsJson;
  }

  // console.log("nftMint ipfs metadata", ipfsJson);
};

// GET minting tx response
const nftMint3TxResponse = async (
  chainId: number,
  address: string,
  ipfsJson: string,
  minter: JsonRpcSigner
): Promise<TransactionResponse | null> => {
  if (!(chainId && address && ipfsJson && minter)) return null;
  // console.log("nftMint3TxResponse", chainId, address, ipfsJson, await minter.getAddress());

  const openNFTs = (await collectionContractGet(chainId, address, minter.provider)).connect(minter);

  type MintOpenNFTFunctionType = {
    (address: string, json: string): Promise<TransactionResponse>;
  };

  // OpenNFTsV0 = addUser
  // OpenNFTsV1 = mintNFT
  // OpenNFTsV2 = mintNFT
  // OpenNFTsV3+ = mintOpenNFT
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mintFunction: MintOpenNFTFunctionType = openNFTs.mintOpenNFT || openNFTs.mintNFT || openNFTs.addUser;
  let urlJson;
  if (ipfsJson.startsWith("ipfs://")) {
    urlJson = ipfsGatewayUrl(ipfsJson);
  } else {
    urlJson = swarmGatewayUrl(ipfsJson);
  }

  const txResp = await mintFunction(await minter.getAddress(), urlJson);
  console.log(`${getNetwork(chainId)?.blockExplorerUrls[0] || ""}/tx/${txResp?.hash || ""}`);

  return txResp;
};

// GET minting tx receipt
const nftMint4 = async (
  chainId: number,
  address: string,
  txResponse: TransactionResponse,
  metadataCid: string,
  minter: string
): Promise<NftType | undefined> => {
  let nft: NftType | undefined = undefined;

  if (txResponse) {
    const txReceipt = await txResponse.wait();
    // console.log("txReceipt", txReceipt);

    if (txReceipt) {
      const tokenID = _mintTokenID(txReceipt);
      // console.log("tokenID", tokenID);

      let urlJson = "";
      if (metadataCid.startsWith("ipfs://")) {
        urlJson = ipfsGatewayUrl(metadataCid);
      } else {
        urlJson = swarmGatewayUrl(metadataCid);
      }
      if (tokenID) {
        nft = await _mintedNft(chainId, address, tokenID, urlJson, minter);
        nft.ipfsJson = metadataCid;
        // console.log("nftMint4", nft);
      }
    }
  }

  return nft;
};

export { nftMintTexts, nftSwarmMintTexts, nftMint1IpfsImage, nftMint2IpfsJson, nftMint3TxResponse, nftMint4 };
