import KredeumNfts from "./kredeum-nfts.svelte";
import KredeumNftsMint from "./kredeum-mint.svelte";

var app = new KredeumNfts({
  target: document.querySelector("#kredeum-app")
});

// var mint = new KredeumNftsMint({
//   target: document.querySelector("#kredeum-mint")
// });

export { app }; //, mint };
