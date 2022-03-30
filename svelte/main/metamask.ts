import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { JsonRpcProvider, JsonRpcSigner } from "@ethersproject/providers";

// Metamask chainId and account
const metamaskChainId: Writable<number> = writable();
const metamaskAccount: Writable<string> = writable();
const metamaskProvider: Writable<JsonRpcProvider> = writable();
const metamaskSigner: Writable<JsonRpcSigner> = writable();

export { metamaskChainId, metamaskAccount, metamaskProvider, metamaskSigner };
