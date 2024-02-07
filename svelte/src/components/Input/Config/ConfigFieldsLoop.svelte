<script lang="ts">
  export let attributesObject;
  export let fieldsGroup;
  export let namespace;

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
</script>

{#each fieldsGroup.fields as fieldEntries, i}
  <div class="kre-section-small">
    {#if !fieldEntries.editableKey}
      <span>{fieldEntries.display || fieldEntries.key}</span>
    {:else}
      <input type="text" class="kre-field-outline" placeholder={fieldEntries.key} bind:value={fieldEntries.key} />
    {/if}
    <input type="text" class="kre-field-outline" placeholder={fieldEntries.value} bind:value={fieldEntries.value} />

    {#if fieldEntries.deletable}
      <button
        value="Remove"
        class="kre-delete-file {!fieldEntries.value && !fieldEntries.key ? 'disabled' : ''}"
        on:click={() => attributesObject.removeField(namespace, i)}
      >
        <i class="fa fa-trash" aria-hidden="true" />
      </button>
    {/if}
  </div>
{/each}

{#if fieldsGroup.editable}
  <button class="kre-button-grey" on:click|preventDefault={() => attributesObject.addField(namespace)}
    ><i class="fa fa-plus fa-left" aria-hidden="true" />Add</button
  >
{/if}

<style>
  .kre-section-small {
    display: flex;
    gap: 5px;
    align-items: center;
  }

  .kre-delete-file {
    background-color: #192146;
    border-radius: 50%;
    width: 35px;
    height: 35px;
    display: flex;
    cursor: pointer;
  }

  .kre-delete-file.disabled {
    opacity: 0.5;
  }

  .kre-delete-file i {
    color: white;
    margin: auto;
  }

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
