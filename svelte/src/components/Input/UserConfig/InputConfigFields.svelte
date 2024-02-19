<script lang="ts">
  import type { StorageConfigType, StorageType } from "@common/common/types";

  import InputConfigChoice from "./InputConfigChoice.svelte";
  import InputConfigField from "./InputConfigField.svelte";

  export let configSection: StorageConfigType;

  interface StorageParamsTypeEntrie {
    [key: string]: string;
  }

  $: storageDefault = configSection.default as StorageType;
  $: storageChoices = Object.keys(configSection).filter((key) => key !== "default" && key !== "errors");

  $: storageFieldsObject = (storageDefault ? configSection[storageDefault] : configSection) as StorageParamsTypeEntrie;
  $: storageFieldsArray = storageFieldsObject && Object.entries(storageFieldsObject);

  $: errorMessages = configSection.errors ? configSection.errors[storageDefault] : undefined;
</script>

{#if storageDefault}
  <InputConfigChoice bind:defaultChoice={configSection.default} choices={storageChoices} />
{/if}

{#if storageFieldsObject && storageFieldsArray}
  {#each storageFieldsArray as [key, value]}
    <InputConfigField bind:key bind:value={storageFieldsObject[key]} />
    <p class="field-error">{errorMessages?.[key] ?? ""}</p>
  {/each}
{/if}

<style>
  .field-error {
    color: red;
  }
</style>
