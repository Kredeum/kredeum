<script lang="ts">
  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkSelect from "../Network/NetworkSelect.svelte";
  import Collections from "../Collection/Collections.svelte";

  /////////////////////////////////////////////////
  // <CollectionChoice bind:{address} {txt} />
  // Choose Collection, after Account Connect and Network choose
  /////////////////////////////////////////////////
  export let address: string = undefined;
  export let txt = true;

  let chainId: number;
  let account: string;
  let signer: string;

  let signerFirst = true;

  $: signer && handleSigner();
  const handleSigner = () => {
    if (signerFirst) {
      signerFirst = false;
      account ||= signer;
    } else account = signer;
  };
</script>

<p>
  <AccountConnect bind:signer {txt} />
</p>
<p>
  <NetworkSelect bind:chainId {txt} />
</p>

{#if chainId && signer}
  <p>
    <Collections {chainId} {account} bind:address {txt} mintable={true} />
  </p>
{/if}
