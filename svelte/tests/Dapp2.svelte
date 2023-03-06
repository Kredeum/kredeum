<script lang="ts">
  import HomeLayout from "../components/Global/HomeLayout.svelte";
  import BreadCrumb from "../components/Global/BreadCrumb.svelte";
  import Nfts from "../components/Nfts/Nfts.svelte";
  import Nft from "../components/Nft/Nft.svelte";
  import { tokenIdCount } from "@lib/common/config";
  import { refPage2UrlHash, refPageFromUrlHash } from "@helpers/refPage";
  import { onMount } from "svelte";
  import { constants } from "ethers";
  import { metamaskSignerAddress } from "@main/metamask";
  import { providerSetFallback } from "@lib/common/provider-get";
  import { metamaskInit, metamaskInstalled } from "@helpers/metamask";

  let chainId: number;
  let address: string;
  let tokenID: string;
  let init = false;

  $: nftCount = tokenIdCount(tokenID);

  // AFTER initalization, set url on chainId, address or account change
  $: init && (window.location.hash = refPage2UrlHash({ chainId, address, tokenID }));

  onMount(async () => {
    const refHash = refPageFromUrlHash(window.location.hash);
    ({ chainId, address, tokenID } = refHash);

    // chainId ||= 1;
    // if (address == constants.AddressZero) address = "0x5c211B8E4f93F00E2BD68e82F4E00FbB3302b35c";
    // tokenID ||= "23,34,2,123,928,7777";

    chainId ||= 137;
    if (address == constants.AddressZero) address = "0x4f1AC217A0D3515e0FD174B2a65ea431af30D212";
    tokenID ||= "1,3";

    console.log("<Dapp2 refHash ", refHash);
    await providerSetFallback(chainId);

    const installed = metamaskInstalled();
    console.log("onMount ~ metamaskInit installed:", installed);

    init = true;
  });
</script>

<HomeLayout>
  <span slot="header">
    {nftCount}
    <BreadCrumb {chainId} {address} {tokenID} display={true} />
  </span>
  <span slot="content">
    {#if nftCount == 1}
      <Nft {chainId} {address} {tokenID} />
      <button class="btn btn-default btn-small" on:click={() => (tokenID = "")}>Back</button>
    {:else}
      <Nfts {chainId} {address} bind:tokenID />
    {/if}
  </span>
</HomeLayout>
