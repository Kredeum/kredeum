import foo from "./version";
import Bonjour from "./Bonjour.svelte";

export default function () {
  console.log(foo);

  const target = document.querySelector("#bonjour");
  if (!target) return;

  new Bonjour({ target, props: { name: "vous" } });
}
