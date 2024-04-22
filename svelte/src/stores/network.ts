import type { Writable } from "svelte/store";
import type { JsonRpcSigner, JsonRpcProvider } from "@ethersproject/providers";
import type { NetworkType } from "@kredeum/common/src/common/types";

import { writable } from "svelte/store";

// Metamask current state, supports only one chain / one account simultaneously
const chainId: Writable<number> = writable();
const network: Writable<NetworkType> = writable();
const provider: Writable<JsonRpcProvider> = writable();
const signer: Writable<JsonRpcSigner> = writable();
const owner: Writable<string> = writable();

export { chainId, network, provider, signer, owner };
