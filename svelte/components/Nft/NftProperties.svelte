<script lang="ts">
  import type { properties } from "@lib/common/ktypes";

  /////////////////////////////////////////////////
  // <NftProperties {properties} />
  // Set Nft properties
  /////////////////////////////////////////////////
  export let properties: properties;

  let attributes = [{ name: "", value: "" }];

  $: attributes && handleProperties();
  const handleProperties = () => {
    properties = attributes
      .filter((attribute) => attribute.name !== "" && attribute.value !== "")
      .reduce((allAttr, attr) => {
        return {
          ...allAttr,
          [attr.name]: { name: attr.name, value: attr.value, display_value: attr.value }
        };
      }, {});
  };

  const addField = (): void => {
    attributes = [...attributes, { name: "", value: "" }];
  };

  const removeField = (i: number): void => {
    if (attributes.length > 1) {
      attributes = attributes.filter((_, index) => i !== index);
    } else {
      attributes[i] = { name: "", value: "" };
    }
  };
</script>

<div class="section">
  <div class="titre">Properties</div>
  {#if attributes}
    {#each attributes as attribute, i}
      <div class="kre-section-small">
        <input type="text" class="kre-field-outline" placeholder="add name" bind:value={attribute.name} />
        <input type="text" class="kre-field-outline" placeholder="add value" bind:value={attribute.value} />

        <button
          value="Remove"
          class="kre-delete-file {attributes.length < 2 ? 'disabled' : ''}"
          on:click={() => removeField(i)}
        >
          <i class="fa fa-trash" aria-hidden="true" />
        </button>
      </div>
    {/each}
  {/if}

  <button class="kre-button-grey" on:click|preventDefault={addField}
    ><i class="fa fa-plus fa-left" aria-hidden="true" />Add</button
  >
</div>

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
