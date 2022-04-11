<script lang="ts">
  import { nftsStore } from "./NftsStore";

  export let tokenID: string;

  $: nft = $nftsStore.get(tokenID);
</script>

<p>
  <img src={nft.image} alt="val" />
  {nft.tokenID}
</p>
