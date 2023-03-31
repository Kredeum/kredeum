<script lang="ts">
  import { templates, templateDescription, templateMerge, templateSubType, templateType } from "@helpers/templates";

  export let template = "OpenAutoMarket/ownable";

  $: template = templateMerge(templateType(template), templateType(template) == "OpenNFTsV4" ? "generic" : "ownable");
</script>

<div class="section">
  <div class="titre">Choose your Collection type</div>
  <div class="box-fields">
    {#each [...templates] as [templateKey, templateValue]}
      {#if templateSubType(templateKey) === "ownable"}
        <input
          class="box-field collection-type"
          id="collection-type-{templateKey}"
          name="collection-type"
          type="radio"
          value={templateValue.name}
          data-toggle="tooltip"
          title={templateValue.description}
          checked={templateType(templateKey) == templateType(template)}
          on:click={() => (template = templateKey)}
        />
        <label class="field" for="collection-type-{templateKey}"
          ><i class="fas fa-{templateValue.icon}" />{templateValue.name}</label
        >
      {/if}
    {/each}
  </div>

  <!-- <div class="section">
    <div class="form-field">
      <input type="checkbox" id="kre-coll-conf" class="" bind:checked={generic} />
      <label for="kre-coll-conf">I want my collection to be generic</label>
    </div>
  </div>
  {#if templateType(template) === "OpenAutoMarket"}
    <div class="section">
      <div class="form-field">
        <input type="checkbox" id="kre-min-royalty" class="" bind:checked={minRoyalty} />
        <label for="kre-min-royalty">With minimum Royalty</label>
      </div>
    </div>
  {/if} -->

  <div class="description">
    <p>
      <i>
        {templateDescription(template)}
      </i>
    </p>
  </div>
</div>

<style>
  /* input[type="checkbox"] {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -border-radius: 4px;
    height: 15px;
    width: 15px;
    background: #fff;
    border: 1px solid #ccc;
  }
  input[type="checkbox"]:checked {
    background-color: #3acf6e;
    margin: 0px;
    position: relative;
  }
  input[type="checkbox"]:checked:before {
    font-family: "Font Awesome";
    content: "\f00c";
    display: block;
    color: grey;
    font-size: 13px;
    position: absolute;
  } */

  :global(.admin-bar .modal-body input[type="checkbox"].collection-type:checked:before) {
    margin: 0;
    top: 50%;
  }
</style>
