import { writable, derived } from "svelte/store";

interface Item {
  chainId: number;
  addr: number;
  name: string;
}

const key = (item: Item): string => `${item.chainId}/${item.addr}`;

const initialValues: Array<Item> = [
  { chainId: 1, addr: 35, name: "col1" },
  { chainId: 137, addr: 23, name: "col2" },
  { chainId: 1, addr: 23, name: "col3" }
];
const initialKeyValues: Array<[string, Item]> = initialValues.map((val: Item) => [key(val), val]);

const { subscribe, set, update } = writable(new Map(initialKeyValues));

const setKey = (val: Item): void => update(($map) => $map.set(key(val), val));

const map = { subscribe, set, setKey, key };

const mapFilter = (chainId: number, addr: number) =>
  derived(map, ($map) =>
    [...$map].filter(([, val]) => {
      const okChain = !chainId || val.chainId === chainId;
      const okAddr = !addr || val.addr === addr;
      return okChain && okAddr;
    })
  );

export { map, mapFilter };
