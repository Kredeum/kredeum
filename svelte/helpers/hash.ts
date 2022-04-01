import { utils } from "ethers";

const hashArray = (arr: Array<unknown>): string => utils.id(JSON.stringify(arr)).slice(0, 10);

export { hashArray };
