<script lang="ts">
  import type { Readable } from "svelte/store";
  import type { CollectionType, NftType } from "@lib/common/types";
  import { metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskAccount, metamaskSigner } from "@main/metamask";
  import { getChainName } from "@lib/common/config";
  import { nftStore } from "@stores/nft/nft";

  import AccountConnect from "../Account/AccountConnect.svelte";
  import Nft from "../Nft/NftOld.svelte";
  import { collectionStore } from "@stores/collection/collection";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string;

  let nfts: Readable<Map<string, NftType>>;
  let collection: Readable<CollectionType>;
  let nfts_list = "";
  let tokenIDi = "";
  //  let nft: Readable<NftType>;
  //  let refreshing: Writable<boolean> = getContext("refreshing");

  console.info("$nfts 1:", $nfts);

  $: account = $metamaskAccount;
  $: nfts;
  $: nfts_list;

  const handleChange = async (): Promise<void> => {
    // console.log(`NFT LIST CHANGE #${i++} ${nftListKey(chainId, address, account)}`);

    // STATE VIEW : sync get Collection
    collection = collectionStore.getOneStore(chainId, address);
    //console.info("COLLECTION cached", $collection);
    //console.log("account collection: ", $collection.owner);

    // STATE VIEW : sync get NFT list
    nfts = nftStore.getSubListStore(chainId, address, $collection.owner);
    //console.info("$nfts 2:", $nfts);
    for (const [key, value] of $nfts) {
      //console.log("nfts[" + `${key}` + "]:",`${key} = ${value.tokenID}`);
      nfts_list +=
        "<Nft " + chainId + " " + address + " " + `${value.tokenID}` + " " + account + " " + platform + " />";
    }
  };

  const handleChainId = async (): Promise<void> => {
    try {
      const messageSwitchTo = `Switch to ${getChainName(chainId)}`;

      if (confirm(messageSwitchTo)) {
        await metamaskSwitchChain(chainId);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  $: tokenID === "All" && handleChange();
  $: chainId > 0 && $metamaskChainId > 0 && $metamaskChainId !== chainId && handleChainId();
</script>

{#if $metamaskSigner}
  <div class="automarket-button">
    {#if $nfts}
      {#each [...$nfts] as [key, value]}
        {#if (tokenID = value.tokenID)}
          <Nft {chainId} {address} {tokenID} {account} {platform} />
        {/if}
      {/each}
    {:else}
      <Nft {chainId} {address} {tokenID} {account} {platform} />
    {/if}
  </div>
{:else}
  <AccountConnect bind:account {platform} />
{/if}

<style>
  :global(.kre-buy-front) {
    width: 300px;
  }

  .automarket-button {
    font-family: "Work Sans", Arial, sans-serif;
    line-height: 1.3;
    font-size: 16px;
  }
</style>
