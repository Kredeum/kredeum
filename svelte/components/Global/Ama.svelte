<script lang="ts">
  import HomeLayout from "../Global/HomeLayout.svelte";
  import Navigation from "../Global/Navigation.svelte";
  import Title from "../Global/Title.svelte";
  import AccountConnect from "../Account/AccountConnect.svelte";
  import NftMintAma from "../Nft/NftMintAma.svelte";

  const prod = process.env.ENVIR === "PROD";
  const mintChainId = prod ? 137 : 137;
  // const mintChainId = prod ? 137 : 80001;
  // const mintChainId = prod ? 137 : 31337;
  const claimChainId = prod ? 10 : 42;

  let account: string;
  let tokenID: string = "";
</script>

<HomeLayout>
  <span slot="nav">
    <Navigation />
  </span>

  <span slot="header">
    <Title />

    <div class="row alignbottom">
      <AccountConnect bind:account />

      {#if account}
        {#if !tokenID}
          <NftMintAma chainId={mintChainId} bind:tokenID type="mint" />
        {:else}
          <NftMintAma chainId={claimChainId} {tokenID} type="claim" />
        {/if}
      {/if}
    </div>
    <div class="row alignbottom">
      {tokenID}
    </div>
  </span>
</HomeLayout>
