import { keccak256, toHex } from "viem";

const hashArray = (arr: Array<unknown>): string => keccak256(toHex(JSON.stringify(arr))).slice(0, 10);

export { hashArray };
