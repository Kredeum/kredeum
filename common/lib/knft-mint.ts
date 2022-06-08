import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { ethers, BigNumber, Contract } from "ethers";
import NftStorage from "./knft-storage";

import type { NftType } from "./ktypes";
import type { OpenMulti } from "types/OpenMulti";
import IOpenMulti from "abis/IOpenMulti.json";
import { ipfsGatewayUrl, textShort, getExplorer, getOpenMulti, DEFAULT_NAME, nftKey } from "./kconfig";
import { nftGetMetadata } from "./knft-get-metadata";
import { collectionContractGet } from "./kcollection-get";

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

  // console.log("nftMint ipfs metadata", ipfsJson);
  return ipfsJson;
};

// GET minting tx response
const nftMint3TxResponse = async (
  chainId: number,
  address: string,
  tokenURI: string,
  minter: JsonRpcSigner
): Promise<TransactionResponse | null> => {
  console.log("nftMint3TxResponse", chainId, address, tokenURI, await minter.getAddress());
  if (!(chainId && address && tokenURI && minter)) return null;

  const openNFTs = (await collectionContractGet(chainId, address, minter.provider)).connect(minter);
  console.log("openNFTs", openNFTs);

  type MintOpenNFTFunctionType = {
    (address: string, json: string): Promise<TransactionResponse>;
  };

  // OpenNFTsV0 = addUser(minter, jsonUri)
  // OpenNFTsV1 = mintNFT(minter, jsonUri)
  // OpenNFTsV2 = mintNFT(minter, jsonUri)
  // OpenNFTsV3+ = mintOpenNFT(minter, jsonUri)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const mintFunction: MintOpenNFTFunctionType = openNFTs.mintOpenNFT || openNFTs.mintNFT || openNFTs.addUser;

  const txResp = await mintFunction(await minter.getAddress(), tokenURI);
  console.log(`${getExplorer(chainId)}/tx/${txResp?.hash || ""}`);

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
  console.log(`nftClaimResponse ${nftKey(chainId, address, tokenID)}`);
  const openMultiAddress = getOpenMulti(chainId);
  if (!(chainId && address && tokenID && owner && openMultiAddress)) return null;

  const openMulti = new Contract(openMultiAddress, IOpenMulti, owner) as OpenMulti;
  // console.log("openMulti", openMulti);

  const txResp = await openMulti.claim(BigNumber.from(tokenID));
  console.log(`${getExplorer(chainId)}/tx/${txResp?.hash || ""}`);

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

  const nft = await _mintedNft(chainId, address, tokenID, ipfsGatewayUrl(metadataCid), minter);
  nft.ipfsJson = metadataCid;
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
  nft.ipfsJson = tokenID;
  console.log("nftClaim4", nft);

  return nft;
};

export {
  nftMintTexts,
  nftMint1IpfsImage,
  nftMint2IpfsJson,
  nftMint3TxResponse,
  nftClaim3TxResponse,
  nftMint4,
  nftClaim4
};
