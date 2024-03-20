<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { writable, type Writable } from "svelte/store";

  import { ADDRESS_ZERO, isCollection, tokenIdCount } from "@common/common/config";
  import { providerSetFallback } from "@common/common/provider-get";

  import { metamaskInit, metamaskSwitchChain } from "@svelte/helpers/metamask";
  import { metamaskChainId } from "@svelte/stores/metamask";

  import Nft from "../Nft/Nft.svelte";
  import Nfts from "../Nfts/Nfts.svelte";
  import { Address } from "viem";

  ////////////////////////////////////////////////////////////////////
  // <OpenSky />
  export let chainId: number = 1;
  export let address: Address = ADDRESS_ZERO;
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
