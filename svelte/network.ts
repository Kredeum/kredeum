import type { Writable } from "svelte/store";
import type { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";

import { writable } from "svelte/store";

const chainId: Writable<number> = writable();
const signer: Writable<JsonRpcSigner> = writable();
const provider: Writable<JsonRpcProvider> = writable();
const owner: Writable<string> = writable();

export { chainId, signer, owner, provider };
