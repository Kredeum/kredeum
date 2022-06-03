// import Home from "../components/Collection/CollectionChoice.svelte";
// import Home from "../tests/Test01.svelte";
import Home from "../components/Global/Home.svelte";
// import Home from "../components/Tests/NftsStore/App.svelte";
// import Home from "../components/Tests/NftsDerived/App.svelte";
import NftMintButton from "../components/Nft/NftMintButton.svelte";
import NetworkList from "../components/Network/NetworkList.svelte";
import CollectionChoice from "../components/Collection/CollectionChoice.svelte";
import WpFrontEntryPoint from "../components/wpfront/WpFrontEntryPoint.svelte";

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

let kredeumHome: Home;
{
  // Kredeum Dapp component
  const target: HTMLElement = document.querySelector("#kredeum-app");
  if (target) {
    kredeumHome = new Home({ target, props: _props(target) });
  }
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

let wpFrontEntryPoint: WpFrontEntryPoint;

// Convert "chainid" in "chainId" & "tokenid" in "tokenID"
const _propsUpCase = (lowCaseProps: object) => {
  const upCaseProps: Props = lowCaseProps as Props;
  for (const [key, value] of Object.entries(lowCaseProps)) {
    if ("chainid" === key) {
      upCaseProps["chainId"] = value as string;
      delete upCaseProps[key];
    } else if ("tokenid" === key) {
      upCaseProps["tokenID"] = value as string;
      delete upCaseProps[key];
    }
  }

  return upCaseProps;
};

{
  // Kredeum Dapp component
  const target: HTMLElement = document.querySelector("#kredeum-wpfront");

  // const wpProps: Props;
  const dataSets: string = target.dataset.props;

  if (target) {
    const wpProps = JSON.parse(dataSets) as Props;
    console.log(_propsUpCase(wpProps));

    wpFrontEntryPoint = new WpFrontEntryPoint({ target, props: { props: _propsUpCase(wpProps) } });
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

export { kredeumHome, kredeumMintButton, kredeumCollectionList, wpFrontEntryPoint, network };
