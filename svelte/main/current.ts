import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

// Metamask chainId and account
const currentTokenID: Writable<string> = writable();
const currentAction: Writable<string> = writable();

export { currentTokenID, currentAction };
