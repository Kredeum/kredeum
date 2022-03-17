<script lang="ts">
  import { onMount } from "svelte";

  import Home from "./Home.svelte";
  import BreadCrumb from "./BreadCrumb.svelte";
  import AccountConnect from "./AccountConnect.svelte";
  import NetworkSelect from "./NetworkSelect.svelte";
  import NetworkSelectLabel from "./NetworkSelectLabel.svelte";
  import CollectionSelect from "./CollectionSelect.svelte";
  import CollectionSelectLabel from "./CollectionSelectLabel.svelte";
  import NftList from "./NftList.svelte";

  import { metamaskInit } from "helpers/metamask";
  import { metamaskChainId } from "main/metamask";

  onMount(async () => {
    await metamaskInit();
  });
</script>

<main>
  <Home />

  <BreadCrumb display={true} />

  <!-- <AccountConnect /> -->

  <!-- <AccountConnect txt={true} />
  <NetworkSelect txt={true} /> -->

  <!-- <NetworkSelectLabel /> -->

  <!-- <NetworkSelect chainId={$metamaskChainId} /> -->

  <!-- <CollectionSelectLabel />

  <NftList /> -->
</main>
