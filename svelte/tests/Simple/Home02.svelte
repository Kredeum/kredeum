<script lang="ts">
  import BreadCrumbSimple from "./BreadCrumbSimple.svelte";
  import MetamaskSimple from "./Network/MetamaskSimple.svelte";

  ////////////////////////////////////////////////////////////////
  // Home02 : chainId and account sync between Url and Metamask
  // Dipslay BreadCrumb
  ////////////////////////////////////////////////////////////////

  let chainId;
  let account;
  let signer;
  let init = true;
  $: console.log("Home02 chainId CHANGE", chainId);
  $: console.log("Home02 account CHANGE", account);
  $: console.log("Home02 signer CHANGE", signer);
  $: console.log("Home02 init CHANGE", init);

  $: signer && handleSigner();
  const handleSigner = () => {
    console.log("Home02 handleSigner", init, account, signer);
    if (init) {
      // set account from url on init (if not null, either initial signer)
      account ||= signer;
      init = false;
    } else {
      // set account from signer on other signer changes
      account = signer;
    }
  };

  const setSigner = () => (account = signer);
</script>

<div>
  <p>
    <BreadCrumbSimple bind:chainId bind:account />
  </p>
  <p>
    <MetamaskSimple bind:chainId bind:signer />
  </p>
  <button on:click={setSigner}> Set signer as account </button>
</div>

<style>
  div {
    padding: 30px;
  }
</style>
