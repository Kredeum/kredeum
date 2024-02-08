<script lang="ts">
  import ConfigField from "./ConfigField.svelte";

  export let attributesObject;
  export let attributes;
  // export let fieldsGroup;
  export let namespace;

  $: defaultFields = attributes[namespace].default;
  $: fieldsGroup = Object.entries(attributes[namespace][defaultFields]);

  $: console.log("defaultFields:", defaultFields);
  $: console.log("fieldsGroup:", fieldsGroup);

  // const addField = (namespace): void => {
  //   console.log("addField ~ attributesObject1:", attributesObject);
  //   attributesObject.addField(namespace);
  //   // attributes[namespace].fields = [...attributes[namespace].fields, { key: "", value: "" }];
  //   console.log("addField ~ attributesObject2:", attributesObject);
  // };

  // const removeField = (namespace: string, i: number): void => {
  //   if (attributes[namespace].fields.length > 1) {
  //     attributes[namespace].fields = attributes[namespace].fields.filter((_, index) => i !== index);
  //   } else {
  //     attributes[namespace].fields[i] = { key: "", value: "" };
  //   }
  // };
  const KRE_KEY = "kre_";

  $: editableFields = fieldsGroup[`${KRE_KEY}editable`];
</script>

{#key defaultFields}
  {#each fieldsGroup as [key, value]}
    {#if !key.startsWith(KRE_KEY)}
      C<ConfigField bind:attributes bind:namespace bind:key />D
    {/if}
  {/each}
{/key}

{#if editableFields}
  <button class="kre-button-grey" on:click|preventDefault={() => attributesObject.addField(namespace)}
    ><i class="fa fa-plus fa-left" aria-hidden="true" />Add</button
  >
{/if}

<style>
  .kre-button-grey {
    border: 2px solid #9a9aa4;
    color: #9a9aa4;
    border-radius: 360px;
    cursor: pointer;
    display: inline-block;
    font-size: 15px;
    padding: 15px 25px;
    transition: all 0.3s ease-in-out;
    vertical-align: middle;
    background-color: white;
  }
</style>
