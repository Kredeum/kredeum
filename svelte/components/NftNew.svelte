<script lang="ts">
  import { getChainName } from "lib/kconfig";

  // <NftView3 {chainId} {chainName} {collection} {tokenId} />
  export let chainId: number;
  export let collection: string;
  export let tokenID: number;
  const chainName = getChainName(chainId);
  const nftRef = `${chainName}/${collection}/${tokenID}`;
</script>

<main>
  <p>
    {nftRef}
  </p>
</main>
