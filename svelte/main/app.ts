// import Dapp from "../tests/Simple/Home08.svelte";
// import Dapp from "../tests/Test02.svelte";
import Dapp from "../components/Main/Dapp2.svelte";
// import Dapp from "../components/Main/Dapp.svelte";
import CollectionChoice from "../components/Main/CollectionChoice.svelte";
import NftAutoMarket from "../components/Main/NftAutomarket.svelte";
import AutoMarket from "../components/Main/Automarket.svelte";
import NftMintButton from "../components/Main/NftMintButton.svelte";
import NetworkSelect from "../components/Network/NetworkSelect.svelte";

type Props = Record<string, string | number | boolean>;
type Attr = { name: string; value: string };

// convert HTML attributes to SVELTE props
// be carefull : attributes are lowercase, props can be mixed case
// filters 'id' and 'class'
const _props = (target: HTMLElement): Props => {
  const props: Props = {};
  Array.from(target?.attributes || []).forEach((attr: Attr): void => {
    let attrName = attr?.name;

    let value: string | number = attr.value;
    if (attrName === "chainid") {
      attrName = "chainId";
      value = Number(value);
    } else if (attrName === "tokenids") {
      attrName = "tokenIDs";
    } else if (attrName === "tokenid") {
      attrName = "tokenID";
    } else if (attrName === "id" || attrName === "class") {
      attrName = null;
    }

    if (attrName) {
      props[attrName] = value;
    }
  });
  return props;
};

{
  // Kredeum Dapp component (Dapp)
  const target: HTMLElement = document.querySelector("#kredeum-dapp");
  if (target) new Dapp({ target });
}

type AutoMarketPropsType = { chainId: number; address: string; tokenIDs: string; platform?: string };
{
  // Kredeum AutoMarket (Multiple NFTs)
  const target: HTMLElement = document.querySelector("#kredeum-automarket");
  if (target) {
    const props = _props(target) as AutoMarketPropsType;
    new AutoMarket({ target, props });
  }
}

type NftAutoMarketPropsType = { chainId: number; address: string; tokenID: string; platform?: string };
{
  // Kredeum NFT AutoMarket (One NFT)
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kredeum-nft-automarket");
  for (const target of targets) {
    const props = _props(target) as NftAutoMarketPropsType;
    new NftAutoMarket({ target, props });
  }
}

type NftMintButtonPropsType = {
  src: string;
  metadata?: string;
  alt?: string;
  pid?: string;
  nid?: string;
  width?: number;
  display?: boolean;
};
{
  // Kredeum Mint Button
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kredeum-nft-mint-button");
  targets?.forEach((target) => {
    const props = _props(target) as NftMintButtonPropsType;
    new NftMintButton({ target, props });
  });
}

type CollectionChoicePropsType = { address?: string; txt?: boolean };
{
  // Kredeum List Collections
  const target: HTMLElement = document.querySelector("#kredeum-collection-choice");
  if (target) {
    const props = _props(target) as CollectionChoicePropsType;
    new CollectionChoice({ target, props });
  }
}

type NetworkSelectPropsType = { chainId: number; txt?: boolean; label?: boolean };
{
  // Kredeum Metamask component
  const target: HTMLElement = document.querySelector("#kredeum-network-select");
  if (target) {
    const props = _props(target) as NetworkSelectPropsType;
    new NetworkSelect({ target, props });
  }
}
