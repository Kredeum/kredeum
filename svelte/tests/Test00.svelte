<script lang="ts">
  import BreadCrumb from "./BreadCrumb.svelte";
  import MetamaskSimple from "./Simple/Network/MetamaskSimple.svelte";

  // import Home from "./HomeView.svelte";
  // import AccountConnect from "../Account/AccountConnect.svelte";
  // import NetworksSelect from "../Network/NetworksSelect.svelte";
  import CollectionSelect from "./CollectionSelect.svelte";
  import { networks } from "@lib/common/networks";
  // import Nfts from "./Nfts.svelte";
  // import NftsGet from "../Nft/NftsGet.svelte";
  // import RefreshButton from "../Nft/NftsRefresh.svelte";
  // import { metamaskInit } from "@helpers/metamask";
  // import { metamaskChainId, metamaskSignerAddress } from "@stores/metamask";
  // import Create from "./Create.svelte";
  // import NftDetail from "./NftDetail.svelte";
  // import NftMint from "../Nft/NftMint.svelte";

  let account: string;
  let chainId: number;
  let address: string;
  let tokenID: string;

  // let refreshing: boolean;
  // let nftsList: () => Promise<void>;
  // let platform = "dapp";
  // let refresh: number;
</script>

<main>
  <div>
    {chainId}/{address || ""}/{tokenID || ""}@{account}

    <BreadCrumb display={true} />

    {#if account && networks.getCreate(chainId)}
      <!-- <Create {chainId} /> -->
      <!-- <NftMint {chainId} /> -->
    {/if}
  </div>

  <div>
    <!-- <Home /> -->

    <MetamaskSimple bind:signer={account} bind:chainId />

    <!-- <AccountConnect bind:account /> -->

    <!-- <NetworksSelect bind:chainId /> -->

    {#if chainId && account}
      <CollectionSelect {chainId} {account} bind:address mintable={true} />
    {/if}
  </div>

  <!-- <div>
    <RefreshButton {refreshing} bind:refresh />

    {#if chainId && address}
      <NftsGet {chainId} {address} {account} bind:refreshing {refresh} />
    {/if}
  </div> -->
</main>

<style>
  div {
    padding: 30px;
  }
</style>
