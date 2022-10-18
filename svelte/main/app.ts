// import Home from "../components/Collection/CollectionChoice.svelte";
// import Home from "../tests/Test01.svelte";
import Home from "../components/Global/Home.svelte";
// import Home from "../components/Tests/NftsStore/App.svelte";
// import Home from "../components/Tests/NftsDerived/App.svelte";
import NftMintButton from "../components/Nft/NftMintButton.svelte";
import NetworkList from "../components/Network/NetworkList.svelte";
import CollectionChoice from "../components/Collection/CollectionChoice.svelte";

import AutoMarketButton from "../components/Global/AutomarketButton.svelte";

type Props = Record<string, string | number>;
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
    kredeumHome = new Home({ target, props: _props(target) });
  }
}

const AutoMarketButtons: Array<AutoMarketButton> = [];
{
  // Kredeum buy nft components
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kre-buy-front");
  targets?.forEach((target, i) => {
    AutoMarketButtons[i] = new AutoMarketButton({
      target,
      props: _props(target)
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
      props: _props(target)
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
      props: _props(target)
    });
  }
}

let network: NetworkList;
{
  // Kredeum Metamask component
  const target: HTMLElement = document.querySelector("#kredeum-metamask");
  if (target) {
    network = new NetworkList({ target, props: _props(target) });
  }
}

export { kredeumHome, kredeumMintButton, AutoMarketButtons, kredeumCollectionList, network };
