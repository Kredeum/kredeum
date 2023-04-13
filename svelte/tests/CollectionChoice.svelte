<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit } from "@helpers/metamask";
  import { metamaskChainId } from "@main/metamask";

  import AccountConnect from "../components/Account/AccountConnect.svelte";
  import NetworkSelect from "../components/Network/NetworkSelect.svelte";
  import CollectionSelect from "../components/Collection/CollectionSelect.svelte";

  /////////////////////////////////////////////////////////////////
  // <CollectionChoice bind:{address} {txt} />
  // Choose Collection, after Account Connect and Network choose
  /////////////////////////////////////////////////////////////////
  export let address: string = undefined;
  export let txt = true;
  /////////////////////////////////////////////////////////////////

  let chainId: number;
  let signer: string;

  // $: console.log("<CollectionChoice", chainId, signer, "=>", address);

  onMount(async () => {
    await metamaskInit();
    chainId = $metamaskChainId;
  });
</script>

<p>
  <AccountConnect bind:signer {txt} />
</p>
<p>
  <NetworkSelect bind:chainId {txt} />
</p>

{#if chainId && signer}
  <p>
    <CollectionSelect {chainId} account={signer} bind:address {txt} mintable={true} />
  </p>
{/if}
