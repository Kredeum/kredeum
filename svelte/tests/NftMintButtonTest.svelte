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
  import NftMintButton from "../components/Nft/NftMintButton.svelte";

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

  onMount(async () => {
    await metamaskInit();
    chainId = $metamaskChainId;
  });
</script>

<main>
  {#if chainId && address && signer}
    <NftMintButton {src} {chainId} {address} {signer} {name} {description} />
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
</style>
