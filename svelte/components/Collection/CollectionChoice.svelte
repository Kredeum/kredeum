<script lang="ts">
  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkSelect from "../Network/NetworkListSelect.svelte";
  import CollectionList from "../CollectionList/CollectionList.svelte";

  /////////////////////////////////////////////////
  // <CollectionChoice bind:{address} {txt} />
  // Choose Collection, after Account Connect and Network choose
  /////////////////////////////////////////////////
  export let address: string = undefined;
  export let txt = true;

  let account: string;
  let chainId: number;
</script>

<p>
  <AccountConnect bind:signer={account} {txt} />
</p>
<p>
  <NetworkSelect bind:chainId {txt} />
</p>

{#if chainId && account}
  <p>
    <CollectionList {chainId} {account} bind:address {txt} mintable={true} />
  </p>
{/if}
