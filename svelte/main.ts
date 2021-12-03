/* eslint-disable @typescript-eslint/no-explicit-any */
import KredeumNfts from "./kredeum-nfts.svelte";
import KredeumNftsMint from "./kredeum-mint.svelte";

const kredeumNftsMints: Array<KredeumNftsMint> = [];
{
  // Kredeum Mint button components
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kredeum-nfts-mint");
  // console.log("targets", targets);

  targets?.forEach((target, i) => {
    const props: unknown = {};
    Array.from(target?.attributes || []).forEach((attr: any) => (props[attr.name] = attr.value));
    kredeumNftsMints[i] = new KredeumNftsMint({ target, props });
  });
}

let kredeumNfts: KredeumNfts;
{
  // Kredeum Dapp component
  const target: HTMLElement = document.querySelector("#kredeum-app");
  if (target) {
    const props: any = {};
    Array.from(target?.attributes || []).forEach((attr: any) => (props[attr?.name] = attr?.value));
    kredeumNfts = new KredeumNfts({ target, props });
  }
}

export { kredeumNfts, kredeumNftsMints };
