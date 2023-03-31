import { id } from "ethers";

const hashArray = (arr: Array<unknown>): string => id(JSON.stringify(arr)).slice(0, 10);

export { hashArray };
