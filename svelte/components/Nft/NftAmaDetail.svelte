<script lang="ts">
  import type { Readable } from "svelte/store";

  import type { NftType } from "lib/ktypes";
  import {
    nftUrl,
    explorerCollectionUrl,
    explorerAddressLink,
    kredeumNftUrl,
    getNetwork,
    nftOpenSeaUrl,
    addressSame,
    nftKey
  } from "lib/kconfig";
  import MediaPreview from "../Media/MediaPreview.svelte";

  import { nftStore } from "stores/nft/nft";

  import { metamaskChainId, metamaskProvider } from "main/metamask";

  import { slide } from "svelte/transition";

  /////////////////////////////////////////////////
  //  <NftAma {chainId} {address} {tokenID} {account}? {tokenIdClaimed}? />
  // Display Minted POAP
  /////////////////////////////////////////////////
  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let account: string = undefined;
  export let refresh: boolean;

  let nft: Readable<NftType>;

  let i = 1;
  // HANDLE CHANGE : on truthy chainId and address, and whatever account
  $: account, chainId && address && tokenID && $metamaskProvider && $metamaskChainId && handleChange();
  const handleChange = async (): Promise<void> => {
    console.log(`NFTDETAIL CHANGE #${i++} ${nftKey(chainId, address, tokenID)}`);
    // refresh = false;

    console.log("Nft 1", $nft);
    // STATE VIEW : sync get Nft
    nft = nftStore.getOneStore(chainId, address, tokenID);
    console.log("Nft 2", $nft);

    // ACTION : async refresh Nft
    await nftStore.refreshOne(chainId, address, tokenID).catch(console.error);
    console.log("Nft 3", $nft);
    refresh = true;
  };

  $: console.log("🚀 ~ TokenID AmaDetail", tokenID);

  const copyToClipboard = async (data, e): Promise<void> => {
    await navigator.clipboard.writeText(data).catch(() => console.log("Not copied"));
    const evtTarget = e.target as HTMLInputElement;
    evtTarget.closest(".copy-container").classList.add("hide-copy");
    evtTarget.closest(".copy-container").querySelector(".copied-msg").innerHTML = "Copied !";

    setTimeout(() => {
      evtTarget.closest(".copy-container").querySelector(".copied-msg").innerHTML = "";
      evtTarget.closest(".copy-container").classList.remove("hide-copy");
    }, 1000);

    console.log("Copied");
  };

  $: console.log("Nft", $nft);
</script>

{#if $nft?.chainId}
  <div class="card-krd" transition:slide>
    <h3>{$nft.name}</h3>
    <p>
      {$nft.description}
    </p>

    <ul class="steps">
      <li>
        <div class="flex"><span class="label"><strong>Token ID</strong></span></div>
        <div
          class="flex copy-container"
          title="Token ID #{tokenID}"
          on:click|preventDefault={(e) => copyToClipboard(tokenID, e)}
        >
          <strong class="overflow-ellipsis">#{tokenID}</strong>
          <i class="fa fa-clone" aria-hidden="true" />
          <div class="copied-msg" />
        </div>
      </li>
      <li>
        <div class="flex"><span class="label">Owner</span></div>
        <div class="flex">{@html explorerAddressLink(chainId, $nft.owner, 15)}</div>
      </li>
      <li>
        <div class="flex"><span class="label">Permanent link</span></div>
        <div class="flex">
          <a
            class="link overflow-ellipsis"
            href={kredeumNftUrl(chainId, $nft)}
            title={nftUrl($nft, 10)}
            target="_blank"
          >
            {@html nftUrl($nft, 10)}
          </a>
        </div>
      </li>
      <li>
        <div class="flex"><span class="label">collection @</span></div>
        <div class="flex">
          <a
            class="link overflow-ellipsis"
            href={explorerCollectionUrl(chainId, address)}
            title={address}
            target="_blank"
          >
            {address}
          </a>
        </div>
      </li>
      <li>
        <div class="flex"><span class="label">Metadata</span></div>
        <div class="flex">
          {#if $nft.tokenURI}
            <a class="link overflow-ellipsis" href={$nft.tokenURI} title={$nft.ipfsJson} target="_blank"
              >{$nft.tokenURI}</a
            >
          {:else}
            NO metadata
          {/if}
        </div>
      </li>
      <li>
        <div class="flex"><span class="label">Image</span></div>
        <div class="flex">
          <a class="link overflow-ellipsis" href={$nft.image} title={$nft.ipfs} target="_blank">
            {$nft.image || ""}
          </a>
        </div>
      </li>
    </ul>
    <div class="btn-opensea">
      <a href={nftOpenSeaUrl($nft.chainId, $nft)} class="btn btn-small btn-sell" title="Sell" target="_blank">
        View on OpenSea
      </a>
    </div>
  </div>
{/if}

<style>
  .copy-container {
    display: flex;
    position: relative;
    cursor: pointer;
  }

  .copy-container:hover::after {
    content: "Copy";
    font-family: Work Sans, Arial, sans-serif;
    position: absolute;
    top: -40px;
    right: -10px;
    padding: 5px 10px;
    border: 1px solid gray;
    border-radius: 6px;
  }

  :global(.copy-container.hide-copy:hover::after) {
    display: none;
  }

  i {
    width: 20px;
    height: 20px;
    color: gray;
  }

  @keyframes copied-anim {
    from {
      opacity: 1;
      top: -40px;
      right: -10px;
    }
    to {
      opacity: 0;
      top: -55px;
      right: -20px;
    }
  }

  .copied-msg {
    position: absolute;
    top: -40px;
    right: -10px;
    opacity: 0;
    animation-name: copied-anim;
    animation-duration: 1s;
    padding: 5px 10px;
    border: 1px solid gray;
    border-radius: 6px;
  }

  .copied-msg:empty {
    display: none;
  }

  .btn-opensea {
    width: 100%;
    text-align: right;
  }

  .btn-opensea a {
    margin-top: 30px;
  }
</style>
