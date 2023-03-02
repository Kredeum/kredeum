<script lang="ts">
  // import type { Readable } from "svelte/store";

  // import AccountConnect from "../components/Account/AccountConnect.svelte";
  import Networks from "../../components/Network/Networks.svelte
  // import NftMintButton from "../Nft/NftMintButton.svelte";
  // import Nfts from "../components/Nft/Nfts.svelte";
  import NftsSimple from "./Simple/NftList/NftListSimple.svelte";
  // import Collections from "../components/Collection/Collections.svelte";
  import CollectionSelectSimple from "../tests/Simple/Collections/CollectionSelectSimple.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import MetamaskSimple from "../tests/Simple/Network/MetamaskSimple.svelte";

  let account: string;
  let signer: string;
  let chainId: number;
  let address: string;
</script>

<div>
  <BreadCrumb display={true} />

  <MetamaskSimple bind:signer />
  <!-- <MetamaskSimple /> -->
  <!-- <AccountConnect bind:account /> -->
  <Networks {chainId} />

  <!-- <NftMintButton /> -->
  <!-- <Collections {chainId} bind:address {account} mintable={false} /> -->
  <CollectionSelectSimple {chainId} bind:address {account} />

  <NftsSimple {chainId} {address} {account} />
</div>

<style>
  div {
    padding: 30px;
  }
</style>
