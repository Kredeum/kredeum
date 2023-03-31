import { getCurrency } from "@lib/common/config";
import { formatEther } from "ethers";

const displayEther = (chainId: number, price: bigint): string => `${formatEther(price || 0n)} ${getCurrency(chainId)}`;

export { displayEther };
