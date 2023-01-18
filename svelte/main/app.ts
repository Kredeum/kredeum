import Home from "../tests/Simple/Home08.svelte";
// import Home from "../tests/Test02.svelte";
// import Home from "../components/Global/Home.svelte";
import NftMintButton from "../components/Nft/NftMintButton.svelte";
import NetworkList from "../components/Network/NetworkList.svelte";
import CollectionChoice from "../components/Collection/CollectionChoice.svelte";

import NftAutoMarket from "../components/Nft/NftAutomarket.svelte";

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

let kredeumHome: Home;
{
  // Kredeum Dapp component
  const target: HTMLElement = document.querySelector("#kredeum-app");
  if (target) {
    kredeumHome = new Home({
      target,
      props: _props(target) as { storage?: string; platform?: string }
    });
  }
}

const nftAutoMarket: Array<NftAutoMarket> = [];
{
  // Kredeum buy nft components
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kredeum-nft-automarket");
  targets?.forEach((target, i) => {
    nftAutoMarket[i] = new NftAutoMarket({
      target,
      props: _props(target) as { chainId: number; address: string; tokenID: string; platform: string }
    });
  });
}

const kredeumMintButton: Array<NftMintButton> = [];
{
  // Kredeum Mint button components
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kredeum-nfts-mint");
  targets?.forEach((target, i) => {
    kredeumMintButton[i] = new NftMintButton({
      target,
      props: _props(target) as {
        src: string;
        metadata?: string;
        alt?: string;
        pid?: string;
        nid?: string;
        width?: number;
        display?: boolean;
      }
    });
  });
}

let kredeumCollectionList: CollectionChoice;
{
  // Kredeum List Collections component
  const target: HTMLElement = document.querySelector("#kredeum-select-collection");
  if (target) {
    kredeumCollectionList = new CollectionChoice({
      target,
      props: _props(target) as { address?: string; txt?: boolean }
    });
  }
}

let network: NetworkList;
{
  // Kredeum Metamask component
  const target: HTMLElement = document.querySelector("#kredeum-metamask");
  if (target) {
    network = new NetworkList({
      target,
      props: _props(target) as { chainId?: number; txt?: boolean; label?: boolean }
    });
  }
}

export { kredeumHome, kredeumMintButton, nftAutoMarket, kredeumCollectionList, network };
