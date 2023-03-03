<script lang="ts">
  import type { Writable } from "svelte/store";
  import { getContext } from "svelte";

  import { explorerCollectionUrl } from "@lib/common/config";

  import NftsDisplayMode from "./NftsDisplayMode.svelte";

  import NftsLines from "./NftsLines.svelte";
  import NftsGrid from "./NftsGrid.svelte";
  import { keyCollection } from "@lib/common/keys";
  import CollectionData from "../Collection/CollectionData.svelte";

  /////////////////////////////////////////////////
  // <NftList {chainId} {address} {account} {refreshing} {platform}? />
  // List Nfts from collection owned by account
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenIDs: string = undefined;
  export let tokenID: string = undefined;
  export let account: string = undefined;

  export let platform: string = "dapp";

  // Context for refreshNfts & refreshing
  ///////////////////////////////////////////////////////////
  // let refreshNfts: Writable<number> = getContext("refreshNfts");
  let refreshing: Writable<boolean> = getContext("refreshing");
  ///////////////////////////////////////////////////////////

  let mode: string = "grid";
</script>

<CollectionData {chainId} {address} {account} let:collection>
  {#if collection}
    <div class="row alignbottom">
      <div class="col col-xs-12">
        <h2>Collection '{collection?.name}'</h2>
        {collection?.balancesOf?.get(account) || 0}
        {collection?.symbol || "NFT"}
        {#if $refreshing}...{/if}
        <a
          class="info-button"
          href={explorerCollectionUrl(chainId, address)}
          title="&#009;Collection address (click to view in explorer)&#013;
      {keyCollection(chainId, address)}"
          target="_blank"
          rel="noreferrer"><i class="fas fa-info-circle" /></a
        >
      </div>
      <div class="col col-xs-12">
        <NftsDisplayMode bind:mode />
      </div>
    </div>

    {#if "list" === mode}
      <NftsLines {chainId} {address} {account} {platform} />
    {:else if "grid" === mode}
      <NftsGrid {chainId} {address} {account} {tokenIDs} bind:tokenID />
    {/if}
  {/if}
</CollectionData>
