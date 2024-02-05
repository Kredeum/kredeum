<script lang="ts">
  import { isAddressNotZero, isCollection, tokenIdCount } from "@kredeum/common/src/common/config";

  import Nfts from "../Nfts/Nfts.svelte";
  import Nft from "../Nft/Nft.svelte";
  // import BreadCrumb from "../Global/BreadCrumb.svelte";
  // import Networks from "../Network/Networks.svelte";

  import { providerSetFallback } from "@kredeum/common/src/common/provider-get";
  import { onMount, setContext } from "svelte";
  import { ADDRESS_ZERO } from "@kredeum/common/src/common/config";

  import { metamaskInit, metamaskSwitchChain } from "@kredeum/svelte/src/helpers/metamask";
  import { metamaskChainId, metamaskSignerAddress } from "@kredeum/svelte/src/stores/metamask";
  import { writable, type Writable } from "svelte/store";

  ////////////////////////////////////////////////////////////////////
  // <OpenSky />
  export let chainId: number = 1;
  export let address: string = ADDRESS_ZERO;
  export let tokenID: string = "";
  ////////////////////////////////////////////////////////////////////

  let refreshingNfts = false;
  let refreshAll: Writable<number> = writable(1);
  setContext("refreshAll", refreshAll);

  let toPlayTokenID: Writable<string> = writable("");
  setContext("toPlayTokenID", toPlayTokenID);

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

<section>
  {#if isCollection({ chainId, address })}
    {#if tokenIdCount(tokenID) == 1}
      <Nft {chainId} {address} {tokenID} details={false} mode="uniq" />
    {:else}
      <Nfts {chainId} {address} {tokenID} bind:refreshing={refreshingNfts} mode="grid3" />
    {/if}
  {/if}
</section>
