<script lang="ts">
  import type { RefNFT } from "@helpers/refNft";
  import { refNFT2Breadcrumb } from "@helpers/refNft";

  export let refNFT: RefNFT;
</script>

<div>
  {refNFT2Breadcrumb(refNFT)}
</div>
