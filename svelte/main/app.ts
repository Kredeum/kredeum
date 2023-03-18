// import Dapp from "../tests/Simple/Home08.svelte";
// import Dapp from "../tests/Test02.svelte";
// import Dapp from "../tests/Dapp2.svelte";
import CollectionChoice from "../components/Main/CollectionChoice.svelte";
import MintButton from "../components/Main/MintButton.svelte";
import NetworkSelect from "../components/Network/NetworkSelect.svelte";
import OpenSky from "../components/Main/OpenSky.svelte";
import Dapp from "../components/Main/Dapp.svelte";

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

{
  // Kredeum Dapp component (Dapp)
  const target: HTMLElement = document.querySelector("#kredeum-dapp");
  if (target) new Dapp({ target });
}

type OpenSkyPropsType = { chainId: number; address: string; tokenID: string;  };
{
  // Kredeum OpenSky (Multiple NFTs)
  const target: HTMLElement = document.querySelector("#kredeum-opensky");
  if (target) {
    const props = _props(target) as OpenSkyPropsType;
    new OpenSky({ target, props });
  }
}

type MintButtonPropsType = {
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
  const targets: NodeListOf<HTMLElement> = document.querySelectorAll(".kredeum-mint-button");
  targets?.forEach((target) => {
    const props = _props(target) as MintButtonPropsType;
    new MintButton({ target, props });
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
