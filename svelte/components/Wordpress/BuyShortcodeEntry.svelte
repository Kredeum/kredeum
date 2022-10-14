<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { CollectionType } from "@lib/common/ktypes";

  import { onMount } from "svelte";

  import {
    getChainName,
    DEFAULT_NAME,
    DEFAULT_SYMBOL,
    explorerCollectionUrl,
    collectionKey
  } from "@lib/common/kconfig";

  import { metamaskChainId, metamaskSigner } from "@main/metamask";
  import { metamaskInit, metamaskConnect, metamaskSwitchChain } from "@helpers/metamask";

  import { collectionStore } from "@stores/collection/collection";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import NftWpBuy from "./NftWpBuy.svelte";

  /////////////////////////////////////////////////
  //  <BuyShortcodeEntry {chainId} {address} {tokenids} />
  // Display Nfts buy cards from token IDs
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenids: string;

  let tokenIDArray: string[];

  let collection: Readable<CollectionType>;
  let account: string = undefined;

  onMount(async () => {
    chainId = Number(chainId);
    await metamaskInit();
    metamaskConnect();
    tokenIDArray = tokenids?.split(",");
  });

  $: chainId > 0 && $metamaskChainId && $metamaskChainId !== chainId && handleChainId();
  const handleChainId = async (): Promise<void> => {
    try {
      const messageSwitchTo = `Switch to ${getChainName(chainId)}`;

      if (confirm(messageSwitchTo)) {
        $metamaskChainId !== chainId;
        await metamaskSwitchChain(chainId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  $: account, chainId && address && handleChange();
  const handleChange = (): void => {
    // console.log(`COLLECTION CHANGE #${i++} ${collectionKey(chainId, address, account)}`);

    // STATE VIEW : sync get Collection
    collection = collectionStore.getOneStore(chainId, address);

    // ACTION : async refresh Collection
    collectionStore.refreshOne(chainId, address, account).catch(console.error);
  };

  $: console.log("handleChange ~ collection", $collection);
</script>

<div class="kre-coll-title">
  <strong>
    {$collection?.name || DEFAULT_NAME}
    {$collection?.symbol || DEFAULT_SYMBOL}
  </strong>
  <a
    class="info-button"
    href={explorerCollectionUrl(chainId, address)}
    title="&#009;  Collection address (click to view in explorer)&#013;
{collectionKey(chainId, address)}"
    target="_blank"><i class="fas fa-info-circle" /></a
  >
</div>

{#if $metamaskSigner && tokenIDArray && $metamaskChainId === chainId}
  <div class="kre-buy-section">
    {#each tokenIDArray as tokenID}
      <NftWpBuy {chainId} {address} {tokenID} />
    {/each}
  </div>
{:else}
  <AccountConnect bind:account />
{/if}

<style>
  .kre-coll-title {
    margin-bottom: 15px;
  }

  .kre-buy-section {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    column-gap: 20px;
    row-gap: 15px;
  }

  :global(.btn-default) {
    padding: 10px 20px !important;
  }
</style>
