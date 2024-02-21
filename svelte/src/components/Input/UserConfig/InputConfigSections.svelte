<script lang="ts">
  import type { UserConfig } from "@svelte/helpers/configHelper";
  import { onMount } from "svelte";

  import { storageConfigInit, checkAndSave } from "@svelte/helpers/configHelper";
  import InputConfigFields from "./InputConfigFields.svelte";

  let userConfig: UserConfig = {};

  onMount(() => {
    userConfig = storageConfigInit(userConfig);
  });

  const saveUserConfig = () => {
    userConfig = checkAndSave(userConfig);
  };
</script>

{#each Object.keys(userConfig) as namespace}
  <div class="titre">
    <i class="fas fa-plus fa-left c-green" />{namespace}
  </div>
  <InputConfigFields bind:configSection={userConfig[namespace]} />
{/each}

<div class="txtright">
  <button type="submit" class="btn btn-default btn-sell" on:click|preventDefault={saveUserConfig}>Save</button>
</div>
