<script lang="ts">
  export let template = "OpenAutoMarket/ownable";
  export let minRoyalty = true;

  let generic = false;

  const templates = new Map([
    [
      "OpenNFTsV4/ownable",
      {
        name: "OpenNFTs",
        description: "OpenNFTs ownable Collection: own your NFT Collection, only you can Mint NFTs",
        icon: "user"
      }
    ],
    [
      "OpenNFTsV4/generic",
      {
        name: "OpenNFTs Generic",
        description: "OpenNFTs generic Collection: anyone can Mint NFTs in this collection!",
        icon: "building"
      }
    ],
    [
      "OpenAutoMarket/ownable",
      {
        name: "AutoMarket",
        description:
          "AutoMarket ownable OpenNFTs Collection: own your collection, mint and sell your NFTs with royalties",
        icon: "dollar-sign"
      }
    ],
    [
      "OpenAutoMarket/generic",
      {
        name: "AutoMarket Generic",
        description: "AutoMarket generic OpenNFTs Collection: anyone can mint, sell or buy NFTs, with royalties",
        icon: "dollar-sign"
      }
    ]
  ]);

  const templateMerge = (templateName: string, templateConfig: string) => `${templateName}/${templateConfig}`;
  const templateSplit = (templateKey: string) => templateKey.split("/");
  const templateName = (templateKey: string) => templateSplit(templateKey)[0];
  const templateConfig = (templateKey: string) => templateSplit(templateKey)[1];

  $: template = templateMerge(templateName(template), templateName(template) == "OpenNFTsV4" ? "generic" : "ownable");

  $: console.log("template", template);
</script>

<div class="section">
  <div class="titre">Choose your Collection type</div>
  <div class="box-fields">
    {#each [...templates] as [templateKey, templateValue]}
      {#if templateConfig(templateKey) === "ownable"}
        <input
          class="box-field collection-type"
          id="collection-type-{templateKey}"
          name="collection-type"
          type="radio"
          value={templateValue.name}
          data-toggle="tooltip"
          title={templateValue.description}
          checked={templateName(templateKey) == templateName(template)}
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
  {#if templateName(template) === "OpenAutoMarket"}
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
        {templates.get(template)?.description || ""}
      </i>
    </p>
  </div>
</div>

<style>
  input[type="checkbox"] {
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
  }

  :global(.admin-bar .modal-body input[type="checkbox"]:checked:before) {
    margin: 0;
    top: 50%;
  }
</style>
