<script lang="ts">
  import AccountConnect from "../Account/AccountConnect.svelte";
  import NetworkList from "../Network/NetworkList.svelte";
  import NftMintButton from "../Nft/NftMintButton.svelte";

  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  import type { Collection as CollectionType } from "lib/ktypes";
  import { collectionGet } from "lib/kcollection-get";
  import { metamaskProvider } from "main/metamask";

  let collectionObject: CollectionType;
  $: _collectionGet(collection).catch(console.error);
  const _collectionGet = async (collection: string): Promise<void> => {
    collectionObject = await collectionGet(chainId, collection, $metamaskProvider, account);
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////////

  let account: string;
  let chainId: number;
  let collection: string;
</script>

<main>
  <!-- <Metamask bind:account bind:chainId /> -->
  <AccountConnect bind:account />
  <NetworkList bind:chainId />

  <NftMintButton />
</main>
