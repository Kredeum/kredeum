// Reexport your entry components here
import Web3Donate from "./web3Donate.svelte";

type Props = Record<string, string | number | boolean>;
type Attr = { name: string; value: string; };

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
            attrName = "";
        }

        if (attrName) {
            props[attrName] = value;
        }
    });
    return props;
};

type Web3DonateType = { receiverAddress: string; };
{
    // Kredeum OpenSky (Multiple NFTs)
    const target = document.querySelector("#kredeum-donate");
    if (target) {
        const props = _props(target as HTMLElement) as Web3DonateType;
        new Web3Donate({ target, props });
    }
}

// export { default as web3Donate } from "./web3Donate.svelte";