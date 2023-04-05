<script lang="ts">
  import { isAddressNotZero, isCollection, isNetwork, tokenIdCount } from "@lib/common/config";

  import Nfts from "../Nfts/Nfts.svelte";
  import Nft from "../Nft/Nft.svelte";
  // import BreadCrumb from "../Global/BreadCrumb.svelte";
  // import Networks from "../Network/Networks.svelte";

  import { providerSetFallback } from "@lib/common/provider-get";
  import { onMount, setContext } from "svelte";
  import { RefPageType } from "@lib/common/types";

  import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";
  import { metamaskChainId, metamaskSignerAddress } from "@main/metamask";
  import { constants } from "ethers";
  import { writable, Writable } from "svelte/store";

  ////////////////////////////////////////////////////////////////////
  // <OpenSky />
  export let chainId: number = 1;
  export let address: string = constants.AddressZero;
  export let tokenID: string = "";
  ////////////////////////////////////////////////////////////////////

  let refreshingNfts = false;
  let refreshAll: Writable<number> = writable(1);
  setContext("refreshAll", refreshAll);

  const setNetwork = async () => {
    if (chainId != $metamaskChainId) {
      await metamaskSwitchChain(chainId);
      await providerSetFallback(chainId);
    }
  };

  onMount(async () => {
    // INIT Metamask
    await metamaskInit();

    // SET network
    await setNetwork();

    // console.info("<OpenSky initialized", { chainId, address, tokenID });
  });
</script>

<main class="main-krd">
  {#if isCollection({ chainId, address })}
    {#if tokenIdCount(tokenID) == 1}
      <Nft {chainId} {address} {tokenID} details={false} mode="detail" />
    {:else}
      <Nfts {chainId} {address} {tokenID} bind:refreshing={refreshingNfts} mode="grid3" />
    {/if}
  {/if}
</main>
