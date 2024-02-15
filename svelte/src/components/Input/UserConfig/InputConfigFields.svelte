<script lang="ts">
  import type { StorageConfigType, StorageParamsType, StorageType } from "@common/common/types";

  import InputConfigChoice from "./InputConfigChoice.svelte";
  import InputConfigField from "./InputConfigField.svelte";

  export let configSection: StorageConfigType;
  //   $: console.log("configSection:", configSection);

  interface StorageParamsTypeEntrie {
    [key: string]: string;
  }

  $: storageDefault = configSection.default as StorageType;
  $: storageChoices = Object.keys(configSection).filter((key) => key !== "default");

  $: storageFieldsObject = (storageDefault ? configSection[storageDefault] : configSection) as StorageParamsTypeEntrie;
  $: storageFieldsArray = storageFieldsObject && Object.entries(storageFieldsObject);
  //   $: console.log("storageFields:", storageFields);
</script>

{#if storageDefault}
  <InputConfigChoice bind:defaultChoice={configSection.default} choices={storageChoices} />
{/if}

{#if storageFieldsObject && storageFieldsArray}
  {#each storageFieldsArray as [key, value]}
    <InputConfigField bind:key bind:value={storageFieldsObject[key]} />
  {/each}
{/if}
