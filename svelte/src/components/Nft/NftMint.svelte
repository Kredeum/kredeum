<script lang="ts">
  import type { BigNumber } from "ethers";

  import type { NftType, Properties } from "@kredeum/common/src/common/types";
  import { nftMint, nftMinted } from "@kredeum/common/src/nft/nft-mint";
  import { nftPin, nftTokenUri } from "@kredeum/common/src/nft/nft-uri";
  import { isAddressNotZero } from "@kredeum/common/src/common/config";
  import { nftStoreSet } from "../../stores/nft/nft";
  import {
    S0_START,
    S1_STORE_IMAGE,
    S2_STORE_METADATA,
    S3_SIGN_TX,
    S4_WAIT_TX,
    S5_MINTED
  } from "../../helpers/nftMint";

  /////////////////////////////////////////////////
  // <NftMint {src} {chainId} {address} {tokenID} {name} {description}  {metadata} />
  // Nft Minted by signer on chainId/address by signer from src image
  // with name, description and whatever metadata (as json string)
  // mining status return to caller
  // nft minted returned to caller
  /////////////////////////////////////////////////
  export let src: string;
  export let chainId: number;
  export let address: string;
  export let signer: string;
  export let price: BigNumber | undefined = undefined;
  export let name: string | undefined = undefined;
  export let description: string | undefined = undefined;
  export let metadata: string | undefined = undefined;
  export let audio: string | undefined = undefined;
  export let pdf: string | undefined = undefined;
  export let properties: Properties | undefined = undefined;
  /////////////////////////////////////////////////
  export let minting: number = S0_START;

  export let imageUri: string | undefined = undefined; // defined after STATE 1
  export let tokenUri: string | undefined = undefined; // defined after STATE 2
  export let audioUri: string | undefined = undefined; // defined after STATE 2
  export let pdfUri: string | undefined = undefined; // defined after STATE 2
  export let txHash: string | undefined = undefined; // defined after STATE 3
  export let nft: NftType | undefined = undefined; // defined after STATE 4
  /////////////////////////////////////////////////

  const _mintingError = (err: string): void => console.error(err);

  // MINTING STATES
  //
  //  STATE 0 Start
  //    |
  //  STATE 1 Store Image
  //    |
  //  STATE 2 Store Metadata
  //    |
  //  STATE 3
  // Ask for signature
  //    |
  //  TEST TxResp --> ERROR sending TX
  //    |
  //  STATE 4 Display TX Hash
  //    |
  //  TEST TxReceipt --> ERROR inside TX
  //    |
  //  STATE 5 End TX & Set NFT in Store
  //

  export const mint = async (): Promise<void> => {
    // console.log("<NftMint", chainId, address);

    if (!src) return _mintingError(`<NftMint ERROR : no image`);

    if (!(chainId && isAddressNotZero(address)))
      _mintingError(`<NftMint ERROR : no collection '${chainId}' '${address}'`);

    if (!isAddressNotZero(signer)) _mintingError(`<NftMint ERROR : no signer`);

    minting = S1_STORE_IMAGE;

    imageUri = await nftPin(chainId, src);

    if (pdf) {
      pdfUri = pdf;
    }

    if (audio) {
      audioUri = await nftPin(chainId, audio);
    }

    minting = S2_STORE_METADATA;

    tokenUri = await nftTokenUri(
      chainId,
      name,
      description,
      imageUri,
      signer,
      src,
      metadata,
      properties,
      audioUri,
      pdfUri
    );

    minting = S3_SIGN_TX;

    const mintingTxResp = await nftMint(chainId, address, tokenUri, signer, price);
    txHash = mintingTxResp?.hash;

    minting = S4_WAIT_TX;

    if (mintingTxResp) {
      nft = await nftMinted(chainId, address, mintingTxResp, tokenUri, signer);

      nftStoreSet(nft);
    }

    minting = S5_MINTED;
  };
</script>
