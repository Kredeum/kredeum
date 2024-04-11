import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";
import { type Address } from "viem";

// Metamask chainId and account
const metamaskChainId: Writable<number> = writable();
const metamaskSignerAddress: Writable<Address> = writable();
const metamaskProvider: Writable<JsonRpcProvider> = writable();
const metamaskSigner: Writable<JsonRpcSigner> = writable();

export { metamaskChainId, metamaskSignerAddress, metamaskProvider, metamaskSigner };
