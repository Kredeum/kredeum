<script lang="ts">
  import type { UserConfig } from "@svelte/helpers/configHelper";
  import { onMount } from "svelte";
  import { fade, fly } from "svelte/transition";
  import { quintOut } from "svelte/easing";

  import { configTexts, configInit, configCheck, configSave } from "@svelte/helpers/configHelper";
  import { strUpFirst } from "@common/common/config";
  import InputConfigFields from "./InputConfigFields.svelte";

  export let open = false;

  let userConfig: UserConfig = {};
  let saveSuccess = false;

  onMount(() => {
    userConfig = configInit(userConfig);
  });

  const saveUserConfig = () => {
    userConfig = configCheck(userConfig);
    saveSuccess = configSave(userConfig);

    if (saveSuccess) setTimeout(() => (open = false), 400);
  };
</script>

{#each Object.keys(userConfig) as namespace}
  <div class="titre">
    <i class="fas fa-plus fa-left c-green" />{strUpFirst(namespace)}
  </div>
  <p>{configTexts[namespace]?.description || ""}</p>
  <InputConfigFields bind:configSection={userConfig[namespace]} sectionTexts={configTexts[namespace]} />
{/each}

<div class="kre-save-config">
  {#if saveSuccess}
    <p
      class="kre-success-message"
      in:fly={{ delay: 0, duration: 300, x: 0, y: 100, opacity: 0.5, easing: quintOut }}
      out:fade={{ duration: 300 }}
    >
      Config Saved !
    </p>
  {/if}
  <button type="submit" class="btn btn-default btn-save" on:click|preventDefault={saveUserConfig}>Save</button>
</div>

<style>
  .kre-save-config {
    display: grid;
    grid-template-columns: auto min-content;
    grid-template-rows: 3em;
    justify-items: center;
    align-items: center;
  }

  .kre-success-message {
    --success-color: rgb(78, 148, 9);
    color: var(--success-color);
    margin: 0;
    padding: 1em;
    border: 1px solid var(--success-color);
    border-radius: 360px;
  }

  .btn-save {
    width: min-content;
    font-weight: 900;
    grid-column: 2;
  }
</style>
