import type { IERC721 } from "@soltypes/OpenNFTs/contracts/interfaces/IERC721";
import type { IERC1155 } from "@soltypes/OpenNFTs/contracts/interfaces/IERC1155";
import type { JsonRpcSigner, TransactionResponse, TransactionReceipt } from "@ethersproject/providers";

import { collectionGetContract } from "@lib/collection/kcollection-get";
import { explorerTxLog } from "../common/kconfig";

async function* burnNft(
  chainId: number,
  address: string,
  tokenID: string,
  signer: JsonRpcSigner
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  let txResp: TransactionResponse | undefined;

  if (!(chainId && address && tokenID && signer)) return txResp;

  const account = await signer.getAddress();

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  const burnOpenNFT = "burn(uint256)";

  if (contract[burnOpenNFT] && !collection.open && account === collection.owner) {
    const burnFunction = contract[burnOpenNFT] as {
      (tokenID: string): Promise<TransactionResponse>;
    };
    txResp = await burnFunction(tokenID);
  }
  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

async function* burnNftAddressDead(
  chainId: number,
  address: string,
  tokenID: string,
  signer: JsonRpcSigner
): AsyncGenerator<TransactionResponse | TransactionReceipt | Record<string, never>> {
  // console.log("transferNft", chainId, address, tokenID, to);

  if (!(chainId && address && tokenID && signer)) return {};

  const fromAddress = await signer.getAddress();
  // console.log("transferNft from", fromAddress);
  const AddressdEaD = "0x000000000000000000000000000000000000dEaD";

  const { contract, collection } = await collectionGetContract(chainId, address, signer);
  // console.log("contract", contract);

  let txResp: TransactionResponse | undefined;
  if (collection.supports?.IERC721) {
    txResp = await (contract as IERC721)["safeTransferFrom(address,address,uint256)"](
      fromAddress,
      AddressdEaD,
      tokenID
    );
  } else if (collection.supports?.IERC1155) {
    txResp = await (contract as IERC1155).safeTransferFrom(fromAddress, AddressdEaD, tokenID, 1, "0x00");
  }
  if (!txResp) return {};
  explorerTxLog(chainId, txResp);

  yield txResp;
  yield await txResp.wait();
}

export { burnNft, burnNftAddressDead };
