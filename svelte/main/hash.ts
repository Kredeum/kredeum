import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

// Url hash chainId and account
const hashChainId: Writable<number> = writable();
const hashCollection: Writable<string> = writable();
const hashTokenID: Writable<string> = writable();
const hashAccount: Writable<string> = writable();

export { hashChainId, hashCollection, hashTokenID, hashAccount };
