<script lang="ts">
  import { onMount } from "svelte";
  import { metamaskInit } from "@helpers/metamask";
  import { metamaskSignerAddress } from "@stores/metamask";

  /////////////////////////////////////////////////
  // <AccountConnect bind:{signer}  />
  // Get Signer from Metamask
  /////////////////////////////////////////////////
  export let signer: string = undefined;

  // change signer on memataskAccount change
  $: signer = $metamaskSignerAddress;
  $: console.log("AccountConnect signer CHANGE", signer);

  // metamask init
  onMount(async () => await metamaskInit());
</script>
