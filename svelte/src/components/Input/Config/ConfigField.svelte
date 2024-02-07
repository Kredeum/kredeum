<script>
  export let attributes;
  export let namespace;
  export let key;
  // export let value;
  let defaultFields;
  let fieldsGroup;
  let value;

  $: attributes && handleAttributesChange();
  const handleAttributesChange = () => {
    defaultFields = attributes[namespace].default;
    fieldsGroup = attributes[namespace][defaultFields];
    value = attributes[namespace][defaultFields][key];
  };

  // $: fieldsGroup = attributes[namespace][defaultFields];
  // console.log("defaultFields:", defaultFields);
  // console.log("fieldsGroup from field:", fieldsGroup);

  const KRE_KEY = "kre_";

  $: editableFields = fieldsGroup[`${KRE_KEY}editable`];

  // $: attributes[namespace][attribute.default];

  let newKey;
  // let oldValue = value;

  $: newKey && handleKeyChange();
  const handleKeyChange = () => {
    delete attributes[namespace][defaultFields][key];
    attributes[namespace][defaultFields][newKey] = value;
  };

  $: value, handleValueChange();
  const handleValueChange = () => {
    attributes[namespace][defaultFields][key] = value;
  };
</script>

<div class="kre-section-small">
  {#if !editableFields}
    <span>{key}</span>
  {:else}
    <input type="text" class="kre-field-outline" placeholder={key} bind:value={newKey} />
  {/if}
  <input type="text" class="kre-field-outline" placeholder={value} bind:value />

  <!-- {#if editableFields}
      <button
        value="Remove"
        class="kre-delete-file {!value && !key ? 'disabled' : ''}"
        on:click={() => attributesObject.removeField(namespace, i)}
      >
        <i class="fa fa-trash" aria-hidden="true" />
      </button>
    {/if} -->
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
</style>
