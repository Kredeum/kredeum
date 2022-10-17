<script lang="ts">
  import { onMount } from "svelte";

  import { metamaskInit } from "@helpers/metamask";
  import { metamaskAccount, metamaskSigner } from "@main/metamask";

  import Nft from "../../components/Nft/Nft.svelte";

  export let chainId: number;
  export let address: string;
  export let tokenID: string;
  export let platform: string;

  $: account = $metamaskAccount;

  onMount(async () => {
    await metamaskInit();
  });
</script>

<div>
  <Nft {chainId} {address} {tokenID} {account} {platform} />
</div>
