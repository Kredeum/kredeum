<script lang="ts">
  import { onMount } from "svelte";

  import Nft from "./Nft.svelte";
  import { nftsStore } from "./NftsStore";
  import { nftsStoreList, nftsStoreListCount } from "./NftsStoreList";

  let i = 1;
  const handleClick = (owner?: string) => {
    nftsStore.setNft(i.toString(), owner);
    console.log("nftsStoreList", $nftsStoreList);
    i++;
  };

  $: countTotal = $nftsStore?.size || 0;
  $: countAl = $nftsStoreListCount.get("al");
  $: countPhil = $nftsStoreList?.get("phil")?.length || 0;

  onMount(async () => {
    nftsStore.setNft("42", "al");
    nftsStore.setNft("6");
  });
</script>

<main>
  <button on:click={() => handleClick("phil")}>MINT PHIL</button>
  <button on:click={() => handleClick("al")}>MINT AL</button>

  <p>
    Total {countTotal} : Al {countAl} - Phil {countPhil}
  </p>

  {#each [...$nftsStoreList] as [owner, tokenIDs]}
    <p>NFT{tokenIDs.length > 1 ? "s" : ""} {owner}</p>
    {#each tokenIDs as tokenID}
      <Nft {tokenID} />
    {/each}
    <hr />
  {/each}
</main>
