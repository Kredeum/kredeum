import type { TransactionResponse, TransactionReceipt } from "@ethersproject/providers";
import { BigNumber, BigNumberish, Contract, PayableOverrides, Signer } from "ethers";
import { ethers, constants } from "ethers";
import type { JsonFragment } from "@ethersproject/abi";

import type { NftType } from "@lib/common/types";

import { explorerTxLog, isEip1559 } from "@lib/common/config";
import { nftGetMetadata } from "@lib/nft/nft-get-metadata";

import type { IOpenNFTsV0 } from "@soltypes/IOpenNFTsV0";
import type { IOpenNFTsV1 } from "@soltypes/IOpenNFTsV1";
import type { IOpenNFTsV2 } from "@soltypes/IOpenNFTsV2";
import type { IOpenNFTsV3Plus } from "@soltypes/IOpenNFTsV3Plus";
import type { OpenAutoMarket } from "@soltypes/OpenAutoMarket";
import type { OpenNFTsV4 } from "@soltypes/OpenNFTsV4";
import { collectionIsOpenMarketable, collectionRoyaltyAccount, collectionRoyaltyFee } from "@lib/collection/collection";
import { ipfsGatewayUrl } from "./storage/ipfs";
import { providerGetSignerOrProvider } from "@lib/common/provider-get";
import { getAbi } from "@lib/common/artifacts";
import { OpenBound } from "@soltypes/OpenBound";

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
const nftClaim = async (
  chainId: number,
  address: string,
  tokenID: string,
  cid: string,
  claimer: string
): Promise<TransactionResponse | undefined> => {
  console.log("nftClaim", chainId, address, tokenID, cid, claimer);

  if (!(chainId && address && address != constants.AddressZero && tokenID && cid && claimer)) return;

  const signer = (await providerGetSignerOrProvider(chainId, true)) as Signer;
  const signerAddress = await signer.getAddress();
  console.log("signerAddress:", signerAddress);

  if (claimer != signerAddress) return;

  const abi = getAbi("IOpenBound");
  console.log("abi:", abi);

  const contract = new Contract(address, abi, signer);
  if (!contract) return;

  console.log("openBound.claim(tokenID,cid)", contract.address, tokenID, cid);
  const txResp = await (contract as OpenBound).claim(tokenID, cid);

  explorerTxLog(chainId, txResp);

  return txResp;
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

export { nftClaim, nftClaimed };
