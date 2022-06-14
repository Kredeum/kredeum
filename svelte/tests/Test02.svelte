<script lang="ts">
  import Nft from "../components/Nft/Nft.svelte";
  import NftSimple from "./NftSimple.svelte";
  import Metamask from "./Metamask.svelte";

  import { metamaskChainId } from "main/metamask";
</script>

<div>
  chainId={$metamaskChainId}

  <Metamask />

  <Nft chainId={1} address="0x5c211B8E4f93F00E2BD68e82F4E00FbB3302b35c" tokenID="7108" />

  <NftSimple chainId={1} address="0x5c211B8E4f93F00E2BD68e82F4E00FbB3302b35c" tokenID="7108" />
</div>
