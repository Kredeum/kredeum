<script lang="ts">
  export let template = "OpenNFTsV4/ownable";
  export let minRoyalty = false;

  let generic = false;

  const templates = new Map([
    [
      "OpenNFTsV4/ownable",
      {
        name: "OpenNFTs",
        description: "Ownable NFTs Collection: own your Collection, only you can Mint NFTs",
        icon: "user"
      }
    ],
    [
      "OpenNFTsV4/generic",
      {
        name: "OpenNFTs Generic",
        description: "Generic NFTs Collection: anyone can Mint NFTs",
        icon: "building"
      }
    ],
    [
      "OpenAutoMarket/ownable",
      {
        name: "AutoMarket",
        description: "AutoMarket NFTs Collection, sell your NFTs with royalties",
        icon: "dollar-sign"
      }
    ],
    [
      "OpenAutoMarket/generic",
      {
        name: "AutoMarket Generic",
        description:
          "AutoMarket generic NFTs Collection, let anyone mint in your NFTs with default mint price & royalties",
        icon: "dollar-sign"
      }
    ]
  ]);

  const templateMerge = (templateName: string, templateConfig: string) => `${templateName}/${templateConfig}`;
  const templateSplit = (templateKey: string) => templateKey.split("/");
  const templateName = (templateKey: string) => templateSplit(templateKey)[0];
  const templateConfig = (templateKey: string) => templateSplit(templateKey)[1];

  $: template = templateMerge(templateName(template), generic ? "generic" : "ownable");

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

  <div class="section">
    <div class="form-field">
      <input type="checkbox" id="kre-coll-conf" class="" bind:checked={generic} />
      <label for="kre-coll-conf">I want my collection to be generic</label>
    </div>
  </div>
  {#if templateName(template) === "OpenAutoMarket"}
    <div class="section">
      <div class="form-field">
        <input type="checkbox" id="kre-min-royalty" class="" bind:checked={minRoyalty} />
        <label for="kre-min-royalty">With minimum royalty</label>
      </div>
    </div>
  {/if}

  <div class="description">
    <p>
      <i>
        {templates.get(template)?.description || ""}
      </i>
    </p>
  </div>
</div>
