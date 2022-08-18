<script lang="ts">
  import { onMount } from "svelte";

  import Nft from "../components/Nft/Nft.svelte";
  import NftSimple from "./NftSimple.svelte";
  import { metamaskInit } from "@helpers/metamask";

  onMount(async () => {
    await metamaskInit();
  });
</script>

<div>
  <Nft chainId={1} address="0x5c211B8E4f93F00E2BD68e82F4E00FbB3302b35c" tokenID="7108" />

  <NftSimple chainId={1} address="0x5c211B8E4f93F00E2BD68e82F4E00FbB3302b35c" tokenID="7108" />
</div>
