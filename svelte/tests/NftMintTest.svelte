<script lang="ts">
  import type { NftType } from "@lib/common/types";
  import { metamaskChainId, metamaskSigner, metamaskSignerAddress } from "@main/metamask";

  import NftMint from "../components/Nft/NftMint.svelte";
  import { onMount } from "svelte";
  import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";
  import { getDappUrl } from "@lib/common/config";
  import AccountConnect from "../components/Account/AccountConnect.svelte";
  import NetworkSelect from "../components/Network/NetworkSelect.svelte";
  import CollectionSelect from "../components/Collection/CollectionSelect.svelte";

  import {
    S0_START,
    S1_STORE_IMAGE,
    S2_STORE_METADATA,
    S3_SIGN_TX,
    S4_WAIT_TX,
    S5_MINTED,
    nftMintTexts
  } from "@helpers/nftMint";

  const src = "https://www.kredeum.com/android-chrome-256x256.png";
  const name = "test";
  const description = "test description";
  let nft: NftType;
  let minting: number;
  let chainId: number;
  let address: string;
  $: signer = $metamaskSigner;
  $: account = $metamaskSignerAddress;
  $: chainId && handleChainId();
  const handleChainId = async () => {
    if (chainId != $metamaskChainId) await metamaskSwitchChain(chainId);
  };
  let mint: () => Promise<void>;

  const view = (evt: Event): string => (location.href = getDappUrl(chainId, nft));

  onMount(async () => {
    await metamaskInit();
    chainId = $metamaskChainId;
  });
</script>

<main>
  {#if chainId && address && signer}
    <NftMint {src} {chainId} {address} {signer} {name} {description} bind:nft bind:minting bind:mint />

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

    <p>Minting {minting} on collection://{chainId}/{address}</p>
  {:else}
    <p><AccountConnect txt={true} label={false} /></p>
    <p><NetworkSelect txt={true} label={false} bind:chainId /></p>
    <p><CollectionSelect txt={true} label={false} {chainId} bind:address {account} /></p>
  {/if}
</main>

<style>
  main {
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
