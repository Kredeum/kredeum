<script lang="ts">
  import type { Nft } from "lib/ktypes";

  export let nft: Nft;
</script>

<p>
  {nft.name}
</p>
<p>
  <img alt={nft.name} width="100px" src={nft.image} />
</p>
<p>
  {nft.description}
</p>
