<script lang="ts">
  import { onMount } from "svelte";

  import { metamaskInit } from "@helpers/metamask";

  import Nft from "../../components/Nft/Nft.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;

  onMount(async () => {
    await metamaskInit();
  });
</script>

<div>
  <Nft {chainId} {address} {tokenID} />
</div>
