<script lang="ts">
  import { metamaskChainId, metamaskSignerAddress } from "@stores/metamask";

  import { onMount } from "svelte";
  import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";
  import AccountConnect from "../components/Account/AccountConnect.svelte";
  import NetworkSelect from "../components/Network/NetworkSelect.svelte";
  import CollectionSelect from "../components/Collection/CollectionSelect.svelte";
  import NftMintButton from "../components/Nft/NftMintButton.svelte";

  const src = "https://wp.kredeum.com/wp-content/uploads/2023/06/Test-image_PID33_2023-06-30-140816.pdf";
  const name = "test";
  const description = "pdf test";
  let chainId: number;
  let address: string;
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
  {chainId} / {address} / {account} / {src}
  {#if chainId && address && account && src}
    <NftMintButton {src} {chainId} {address} signer={account} {name} {description} />
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
