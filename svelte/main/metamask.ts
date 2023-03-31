import type { Writable } from "svelte/store";
import { writable } from "svelte/store";
import type { BrowserProvider, JsonRpcSigner } from "ethers";

// Metamask chainId and account
const metamaskChainId: Writable<number> = writable();
const metamaskSignerAddress: Writable<string> = writable();
const metamaskProvider: Writable<BrowserProvider> = writable();
const metamaskSigner: Writable<JsonRpcSigner> = writable();

export { metamaskChainId, metamaskSignerAddress, metamaskProvider, metamaskSigner };
