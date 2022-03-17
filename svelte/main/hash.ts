import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

// Url hash chainId and account
const hashChainId: Writable<number> = writable();
const hashAccount: Writable<string> = writable();
const hashCollection: Writable<string> = writable();
const hashTokenID: Writable<string> = writable();

export { hashChainId, hashAccount, hashCollection, hashTokenID };
