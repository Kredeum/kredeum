<script lang="ts">
  import type { JsonRpcSigner } from "@ethersproject/providers";

  import type { NftType } from "@lib/common/types";
  import { nftImageUri, nftTokenUri, nftMint, nftMint4 } from "@lib/nft/nft-mint";
  import { explorerTxLog, getDappUrl, isAddressNotZero } from "@lib/common/config";

  /////////////////////////////////////////////////
  // <NftMint {src} {chainId} {address} {tokenID} {name} {description}  {metadata} />
  // Mint one nft on collection chainId/address from src image with metadata
  // tokenID, returned to caller
  /////////////////////////////////////////////////
  export let src: string;
  export let chainId: number;
  export let address: string;
  export let signer: JsonRpcSigner;
  export let nft: NftType = undefined;
  export let name: string = undefined;
  export let description: string = undefined;
  export let metadata: string = undefined;
  export let ref: string = "uniq";
  /////////////////////////////////////////////////

  let imageUri: string;
  let minting: number = 0;

  const nftMintTexts = [
    "Mint",
    "Wait till Image stored on decentralized storage",
    "Wait till Metadata stored on decentralized storage",
    "Please, sign the transaction",
    "Wait till transaction completed, it may take one minute or more..."
  ];

  const view = (e: Event): string => (location.href = getDappUrl(chainId, nft));

  const mint = async (e: Event): Promise<void> => {
    const signerAddress = await signer.getAddress();

    if (!(chainId && isAddressNotZero(address) && src && isAddressNotZero(signerAddress))) {
      console.error("<NftMint ERROR : no collection or image", chainId, address, src, signerAddress);
      return null;
    }

    minting = 1;

    imageUri = await nftImageUri(src);
    console.info("imageUri", imageUri);

    minting = 2;

    const tokenUri = await nftTokenUri(name, description, imageUri, signerAddress, src, metadata);
    console.info("tokenUri", tokenUri);

    minting = 3;

    const mintingTxResp = await nftMint(chainId, address, tokenUri, signer);
    explorerTxLog(chainId, mintingTxResp);

    minting = 4;

    nft = await nftMint4(chainId, address, mintingTxResp, tokenUri, signerAddress);
    console.info("nft #${nft.tokenID}", nft);

    minting = 5;
  };
</script>

<div id="mint-{ref}">
  {#if minting === 0}
    <button on:click={mint} class="btn btn-small btn-mint"> MINT NFT </button>
  {:else if 1 <= minting && minting <= 4}
    <button class="btn btn-small btn-minting">
      MINTING {minting}/4...
    </button>
    <em>{nftMintTexts[minting]}</em>
  {:else if minting === 5}
    <button on:click={view} class="btn btn-small btn-view" title="View in Explorer"> VIEW NFT </button>
  {:else}
    <em>Error minting #{minting}</em>
  {/if}
</div>
