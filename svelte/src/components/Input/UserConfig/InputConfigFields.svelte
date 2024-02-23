<script lang="ts">
  import type { ConfigSectionMap, SectionErrors } from "@svelte/helpers/configHelper";

  import InputConfigChoice from "./InputConfigChoice.svelte";
  import InputConfigField from "./InputConfigField.svelte";

  export let configSection: ConfigSectionMap;
  export let sectionTexts: { [key: string]: string | undefined } = {};

  let defaultChoice = configSection.get("default") as string;
  $: storageChoices = Array.from(configSection.keys()).filter((key) => key !== "default" && key !== "errors");
  let fields: Array<[string, string]>;

  $: defaultChoice, handleChoice();
  const handleChoice = () => {
    defaultChoice && configSection.set("default", defaultChoice);
    fields = defaultChoice
      ? Object.entries(configSection.get(defaultChoice) as object)
      : Array.from(configSection.entries());
  };

  $: fields && handleFieldsInput();
  const handleFieldsInput = () => {
    defaultChoice ? configSection.set(defaultChoice, Object.fromEntries(fields)) : (configSection = new Map(fields));
  };

  $: errorMessages = (configSection.get("errors") as SectionErrors)?.get(defaultChoice);
</script>

{#if defaultChoice}
  <InputConfigChoice bind:defaultChoice choices={storageChoices} />
  {#if sectionTexts[defaultChoice]}
    <p><i class="fas fa-info-circle"></i> {sectionTexts[defaultChoice]}</p>
  {/if}
{/if}

{#if fields}
  {#each [...fields] as [key, value]}
    <InputConfigField bind:key bind:value error={errorMessages?.get(key)} />
  {/each}
{/if}
