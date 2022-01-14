import type { Signer } from "ethers";
import type { Nft, Collection } from "./ktypes";
import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import { ethers } from "ethers";
import NftStorage from "./knft-storage";
import { ipfsGatewayUrl, textShort, explorerCollectionUrl } from "./knfts";
import { nftGetMetadata } from "./knft-get";
import { collectionGetContract } from "./kcollection-get";
import { getNetwork } from "./kconfig";

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
  collection: Collection,
  tokenID: string,
  urlJson: string,
  minterAddress: string
): Promise<Nft> => {
  const nft = await nftGetMetadata(chainId, {
    chainId,
    collection: collection.address,
    tokenID,
    tokenURI: urlJson,
    creator: minterAddress,
    minter: minterAddress,
    owner: minterAddress
  } as Nft);
  return nft;
};

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
  return `ipfs://${await nftStorage.pinUrl(image)}`;
};

// GET ipfs metadata url
const nftMint2IpfsJson = async (name = "No name", ipfs = "", address = "", image = "", key = ""): Promise<string> => {
  nftStorage = nftStorage || new NftStorage(key);

  const ipfsJson = await nftStorage.pinJson({
    name,
    description: name || "",
    image: ipfsGatewayUrl(ipfs),
    ipfs,
    origin: textShort(image, 140),
    minter: address,
    metadata: {}
  } as Nft);
  return ipfsJson;
};

// GET minting tx response
const nftMint3TxResponse = async (
  chainId: number,
  collection: Collection,
  ipfsJson: string,
  minter: Signer
): Promise<TransactionResponse | null> => {
  let txResp: TransactionResponse | null = null;

  // console.log("nftMint3TxResponse", chainId, collection.address, ipfsJson, await minter.getAddress());

  const network = getNetwork(chainId);
  const urlJson = ipfsGatewayUrl(ipfsJson);
  const openNFTs = await collectionGetContract(chainId, collection, minter.provider);
  // console.log("openNFTs", openNFTs);

  if (openNFTs?.mintNFT) {
    // const txOptions = {
    //   maxPriorityFeePerGas: utils.parseUnits("50", "gwei"),
    //   maxFeePerGas: utils.parseUnits("50", "gwei"),
    //   type: 2
    // };

    txResp = await openNFTs.connect(minter).mintNFT(await minter.getAddress(), urlJson);
    console.log(`${network?.blockExplorerUrls[0]}/tx/${txResp?.hash}`);
  } else {
    console.error("No OpenNFTs openNFTs found @", explorerCollectionUrl(chainId, collection.address));
  }

  return txResp;
};

// GET minting tx receipt
const nftMint4 = async (
  _chainId: number,
  _collection: Collection,
  _txResponse: TransactionResponse,
  _metadataCid: string,
  _minter: string
): Promise<Nft | undefined> => {
  let _nft: Nft | undefined = undefined;

  if (_txResponse) {
    const _txReceipt = await _txResponse.wait();
    // console.log("txReceipt", txReceipt);

    if (_txReceipt) {
      const _tokenID = _mintTokenID(_txReceipt);
      // console.log("tokenID", tokenID);

      if (_tokenID) {
        _nft = await _mintedNft(_chainId, _collection, _tokenID, ipfsGatewayUrl(_metadataCid), _minter);
        _nft.ipfsJson = _metadataCid;
        // console.log("nftMint4", _nft);
      }
    }
  }

  return _nft;
};

export { nftMintTexts, nftMint1IpfsImage, nftMint2IpfsJson, nftMint3TxResponse, nftMint4 };
