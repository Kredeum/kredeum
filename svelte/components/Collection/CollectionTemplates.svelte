<script lang="ts">
  export let template = "OpenNFTsV4/ownable";

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

  const templateType = (templateVersion: string) => {
    return templateVersion.split("/")[1];
  };

  $: generic
    ? (template = template.replace("ownable", "generic"))
    : (template = template.replace("generic", "ownable"));
  $: console.log("🚀 ~ file: CollectionTemplates.svelte ~ line 47 ~ generic", generic);

  $: console.log("template", template);
</script>

<div class="section">
  <div class="titre">Choose your Collection type</div>
  <div class="box-fields">
    {#each [...templates] as [key, value]}
      {#if templateType(key) === "ownable"}
        <input
          class="box-field collection-type"
          id="collection-type-{key}"
          name="collection-type"
          type="radio"
          value={value.name}
          data-toggle="tooltip"
          title={value.description}
          checked={key.split("/")[0] == template.split("/")[0]}
          on:click={() => (template = key)}
        />
        <label class="field" for="collection-type-{key}"><i class="fas fa-{value.icon}" />{value.name}</label>
      {/if}
    {/each}
  </div>

  <div class="section">
    <div class="form-field">
      <input type="checkbox" class="" bind:checked={generic} /> I want my collection to be generic
    </div>
  </div>

  <div class="description">
    <p>
      <i>
        {templates.get(template)?.description || ""}
      </i>
    </p>
  </div>
</div>
