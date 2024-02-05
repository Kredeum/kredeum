import Dapp from "@kredeum/svelte/src/components/Main/Dapp.svelte";

export default function () {
  const target = document.querySelector("#kredeum-dapp");
  if (!target) return;

  new Dapp({ target });
}
