<script lang="ts">
  import InputConfigChoice from "./InputConfigChoice.svelte";
  import InputConfigField from "./InputConfigField.svelte";

  export let configSection: Map<string, any>;

  let defaultChoice = configSection.get("default");
  $: storageChoices = Array.from(configSection.keys()).filter((key) => key !== "default" && key !== "errors");
  let fields: Array<[string, string]>;

  $: defaultChoice, handleChoice();
  const handleChoice = () => {
    defaultChoice && configSection.set("default", defaultChoice);
    fields = defaultChoice ? Object.entries(configSection.get(defaultChoice)) : Array.from(configSection.entries());
  };

  $: fields && handleFieldsInput();
  const handleFieldsInput = () => {
    defaultChoice ? configSection.set(defaultChoice, Object.fromEntries(fields)) : (configSection = new Map(fields));
  };

  $: errorMessages = configSection.get("errors")?.get(defaultChoice);
</script>

{#if defaultChoice}
  <InputConfigChoice bind:defaultChoice choices={storageChoices} />
{/if}

{#if fields}
  {#each [...fields] as [key, value]}
    <InputConfigField bind:key bind:value error={errorMessages?.get(key)} />
  {/each}
{/if}
