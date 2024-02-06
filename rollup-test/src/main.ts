import type { NftType } from "@kredeum/rollup-test/src/types";

import foo from "./version";
import Bonjour from "./Bonjour.svelte";

export default function () {
  console.log(foo);

  const target = document.querySelector("#bonjour");
  if (!target) return;

  const nft: NftType = { chainId: 1, tokenID: "1" };

  console.log("nft:", nft);
  new Bonjour({ target, props: { name: "vous" } });
}
