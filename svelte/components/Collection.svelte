<script lang="ts">
  import type { Collection } from "lib/ktypes";
  import { collectionName } from "lib/kconfig";
  import { collectionGet } from "lib/kcollection-get";

  import { metamaskProvider } from "main/metamask";

  /////////////////////////////////////////////////
  // <Collection {collectionObject} {minting}  />
  // Display Collection
  /////////////////////////////////////////////////
  export let collectionObject: Collection;
  export let minting: boolean = false;

  const collectionBalanceOf = (_collectionObject: Collection) =>
    _collectionObject?.balanceOf || (_collectionObject?.balanceOf == 0 ? "0" : "?");

  const collectionNameAndBalanceOf = (_collectionObject: Collection, choose = false) => {
    // console.log("collectionNameAndBalanceOf ~ _collectionObject", _collectionObject);

    return _collectionObject && (!choose || _collectionObject.mintable)
      ? `${collectionName(_collectionObject)} (${collectionBalanceOf(_collectionObject)})`
      : "Choose collection";
  };
</script>

{collectionNameAndBalanceOf(collectionObject, minting)}
