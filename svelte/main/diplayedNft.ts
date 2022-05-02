import type { Writable } from "svelte/store";
import { writable } from "svelte/store";

// Displayed Nft tokenID
const displayedTokenID: Writable<string> = writable();

export { displayedTokenID };
