import KredeumNfts from "./kredeum-nfts.svelte";
import KredeumNftsMint from "./kredeum-mint.svelte";
import KredeumMetamask from "./kredeum-metamask.svelte";

type Props = Record<string, string>;
type Attr = { name: string; value: string };

const kredeumNftsMints: Array<KredeumNftsMint> = [];
{
  // Kredeum Mint button components
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kredeum-nfts-mint");

  // console.log("targets", targets);

  targets?.forEach((target, i) => {
    const props: Props = {};
    Array.from(target?.attributes || []).forEach((attr: Attr): void => {
      props[attr.name] = attr.value;
    });
    kredeumNftsMints[i] = new KredeumNftsMint({ target, props });
  });
}

let kredeumNfts: KredeumNfts;
{
  // Kredeum Dapp component
  const target: HTMLElement = document.querySelector("#kredeum-app");
  if (target) {
    const props: Props = {};
    Array.from(target?.attributes || []).forEach((attr: Attr): void => {
      props[attr?.name] = attr?.value;
    });
    kredeumNfts = new KredeumNfts({ target, props });
  }
}

let kredeumMetamask: KredeumMetamask;
{
  // Kredeum Dapp component
  const target: HTMLElement = document.querySelector("#kredeum-metamask");
  if (target) {
    const props: Props = {};
    Array.from(target?.attributes || []).forEach((attr: Attr): void => {
      props[attr?.name] = attr?.value;
    });
    kredeumMetamask = new KredeumMetamask({ target, props });
  }
}

export { kredeumNfts, kredeumNftsMints, kredeumMetamask };
