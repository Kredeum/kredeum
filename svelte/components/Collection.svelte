<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import { collectionName } from "lib/kconfig";

  export let collection: Collection;
  export let minting: boolean = false;

  const collectionBalanceOf = (collContract: Collection) =>
    collContract?.balanceOf || (collContract?.balanceOf == 0 ? "0" : "?");

  const collectionNameAndBalanceOf = (collContract: Collection, choose = false) =>
    collContract && (!choose || collContract.mintable)
      ? `${collectionName(collContract)} (${collectionBalanceOf(collContract)})`
      : "Choose collection";
</script>

{collectionNameAndBalanceOf(collection, minting)}
