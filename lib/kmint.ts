import type { Signer } from "ethers";
import type { Nft } from "./ktypes";
import type { TransactionResponse, TransactionReceipt } from "@ethersproject/abstract-provider";

import { ethers } from "ethers";
import NftStorage from "./knft-storage";
import { ipfsUrl, ipfsGatewayUrl, textShort, explorerCollectionUrl } from "./knfts";
import { getCollection, addNftMetadata } from "./klist-nfts";
import { getNetwork } from "./kconfig";

let nftStorage: NftStorage;

const _mintTokenID = (txReceipt: TransactionReceipt): string => {
  let tokenID = "";

  // console.log("txReceipt", txReceipt);
  if (txReceipt.logs) {
    const abi = [
      "event Transfer(address indexed from, address indexed to, uint256 indexed tokenID);"
    ];
    const iface = new ethers.utils.Interface(abi);
    const log = iface.parseLog(txReceipt.logs[0]);
    ({ tokenID } = log.args);
  }

  // const tokenID = res.events[0].args[2].toString();
  return tokenID;
};

const _mintedNft = async (
  chainId: number,
  collection: string,
  tokenID: string,
  urlJson: string,
  minterAddress: string
): Promise<Nft> => {
  const nft = await addNftMetadata(chainId, {
    chainId,
    collection,
    tokenID,
    tokenURI: urlJson,
    creator: minterAddress,
    minter: minterAddress,
    owner: minterAddress
  } as Nft);
  return nft;
};

const mintingTexts = [
  "Mint",
  "Wait till Image stored on IPFS",
  "Wait till Metadata stored on IPFS",
  "Please, sign the transaction",
  "Wait till transaction completed, it may takes one minute or more..."
];

// GET ipfs image cid
const mint1cidImage = async (image: string, key = ""): Promise<string> => {
  nftStorage = nftStorage || new NftStorage(key);
  return await nftStorage.pinUrl(image);
};

// GET ipfs metadata url
const mint2cidJson = async (
  _name = "No name",
  _cid = "",
  _address = "",
  _image = "",
  key = ""
): Promise<string> => {
  nftStorage = nftStorage || new NftStorage(key);

  const cidJson = await nftStorage.pinJson({
    name: _name,
    description: _name || "",
    cid: _cid,
    image: ipfsGatewayUrl(_cid),
    ipfs: ipfsUrl(_cid),
    origin: textShort(_image, 140),
    minter: _address,
    metadata: {}
  } as Nft);
  return cidJson;
};

// GET minting tx response
const mint3TxResponse = async (
  chainId: number,
  collection: string,
  cidJson: string,
  minter: Signer
): Promise<TransactionResponse | null> => {
  let txResp: TransactionResponse | null = null;

  // console.log("mint3TxResponse", chainId, collection, cidJson, await minter.getAddress());

  const network = getNetwork(chainId);
  const urlJson = ipfsGatewayUrl(cidJson);
  const openNFTs = await getCollection(chainId, collection, minter.provider);
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
    console.error("No OpenNFTs openNFTs found @", explorerCollectionUrl(chainId, collection));
  }

  return txResp;
};

// GET minting tx receipt
const mint4Nft = async (
  _chainId: number,
  _address: string,
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
        _nft = await _mintedNft(
          _chainId,
          _address,
          _tokenID,
          ipfsGatewayUrl(_metadataCid),
          _minter
        );
        _nft.cidJson = _metadataCid;
        // console.log("mint4Nft", _nft);
      }
    }
  }

  return _nft;
};

export { mintingTexts, mint1cidImage, mint2cidJson, mint3TxResponse, mint4Nft };
