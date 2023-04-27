<script lang="ts">
  import type { BigNumber } from "ethers";
  import { onMount } from "svelte";
  import { metamaskInit } from "@helpers/metamask";

  import type { NftType, Properties } from "@lib/common/types";
  import NftMint from "./NftMint.svelte";

  import { S0_START, S5_MINTED, nftMintTexts } from "@helpers/nftMint";
  import { getDappUrl } from "@lib/common/config";

  /////////////////////////////////////////////////
  // <NftMintButton {src} {chainId} {address} {tokenID} {name} {description}  {metadata} />
  // Nft Minted by signer on chainId/address by signer from src image
  // with name, description and whatever metadata (as json string)
  // mining status return to caller
  // nft minted returned to caller
  /////////////////////////////////////////////////
  export let src: string;
  export let chainId: number;
  export let address: string;
  export let signer: string;
  export let price: BigNumber = undefined;
  export let name: string = undefined;
  export let description: string = undefined;
  export let metadata: string = undefined;
  export let audio: string = undefined;
  export let properties: Properties = undefined;
  /////////////////////////////////////////////////
  export let nft: NftType = undefined;
  /////////////////////////////////////////////////

  let minting: number = 0;

  let mint: () => Promise<void>;
  const _mint = async (evt: Event): Promise<void> => {
    evt.preventDefault();
    await mint();
  };

  const view = (evt: Event): void => {
    evt.preventDefault();
    location.href = getDappUrl(chainId, nft);
  };

  onMount(async () => await metamaskInit());
</script>

<div class="kredeum-mint">
  {#if src && chainId && address && signer}
    <NftMint
      {src}
      {chainId}
      {address}
      {signer}
      {price}
      {metadata}
      {properties}
      {name}
      {description}
      {audio}
      bind:nft
      bind:minting
      bind:mint
    />

    {#if minting === S0_START}
      <button on:click={_mint} class="btn btn-small btn-mint"> MINT NFT </button>
    {:else if S0_START < minting && minting < S5_MINTED}
      <button class="btn btn-small btn-minting">
        MINTING {minting}/4...
      </button>
      <em>{nftMintTexts[minting]}</em>
    {:else if minting === S5_MINTED}
      <button on:click={view} class="btn btn-small btn-view" title="View in Explorer"> VIEW NFT </button>
    {:else}
      <em>Error minting #{minting}</em>
    {/if}
  {/if}
</div>

<style>
  .kredeum-mint {
    padding: 20px;
  }

  button.btn {
    color: white;
    background-color: #2a81de;
    border: 0px;
    margin: 10px;
    padding: 8px 15px;
    border-radius: 360px;
    border: none;
    width: fit-content;
    transition: all 300ms ease-in-out;
    display: inline-block;
    vertical-align: middle;
    text-transform: uppercase;
    font-weight: bold;
    font-size: 12px;
    cursor: pointer;
  }
  button.btn-mint {
    background-color: #2a81de;
  }
  button.btn-minting {
    /* color: black; */
    background-color: grey;
  }
  button.btn-mint:hover {
    background-color: black;
    cursor: pointer;
  }
  button.btn-view {
    background-color: #3acf6e;
  }

  button.btn-view:hover {
    background-color: #2aac57;
  }
</style>
