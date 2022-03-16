import KredeumNfts from "../components/HomeView.svelte";
import KredeumNftsMint from "../components/NftMintView2.svelte";
import NetworkSelect from "../components/NetworkSelect.svelte";
import KredeumSelectCollection from "../components/CollectionSelect.svelte";

type Props = Record<string, string>;
type Attr = { name: string; value: string };

// convert HTML attributes to SVELTE props
// be carefull : attributes are lowercase, props can be mixed case
// filters 'id' and 'class'
const _props = (target: HTMLElement): Props => {
  const props: Props = {};
  Array.from(target?.attributes || []).forEach((attr: Attr): void => {
    let attrName = attr?.name;

    if (attrName === "chainid") {
      attrName = "chainId";
    } else if (attrName === "id" || attrName === "class") {
      attrName = null;
    }

    if (attrName) {
      props[attrName] = attr.value;
    }
  });
  return props;
};

let kredeumNfts: KredeumNfts;
{
  // Kredeum Dapp component
  const target: HTMLElement = document.querySelector("#kredeum-app");
  if (target) {
    kredeumNfts = new KredeumNfts({ target, props: _props(target) });
  }
}

const kredeumNftsMints: Array<KredeumNftsMint> = [];
{
  // Kredeum Mint button components
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kredeum-nfts-mint");
  targets?.forEach((target, i) => {
    kredeumNftsMints[i] = new KredeumNftsMint({
      target,
      props: _props(target)
    });
  });
}

let networkView: NetworkSelect;
{
  // Kredeum Metamask component
  const target: HTMLElement = document.querySelector("#kredeum-metamask");
  if (target) {
    networkView = new NetworkSelect({ target, props: _props(target) });
  }
}

let kredeumSelectCollection: KredeumSelectCollection;
{
  // Kredeum List Collections component
  const target: HTMLElement = document.querySelector("#kredeum-select-collection");
  if (target) {
    kredeumSelectCollection = new KredeumSelectCollection({
      target,
      props: _props(target)
    });
  }
}

export { kredeumNfts, kredeumNftsMints, networkView, kredeumSelectCollection };
