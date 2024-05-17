<script lang="ts">
  export let template = "OpenAutoMarket/ownable";
  // export let minRoyalty = true;

  // let generic = false;

  const templates = new Map([
    [
      "OpenNFTsV4/generic",
      {
        name: "OpenNFTs",
        description: "OpenNFTs generic Collection: anyone can Mint NFTs in this collection!",
        icon: "building",
        network: "all"
      }
    ],
    [
      "OpenNFTsV4Skale/generic",
      {
        name: "Skale OpenNFTs",
        description: "OpenNFTs generic Skale Collection: anyone can Mint NFTs in this collection!",
        icon: "building",
        network: "skale"
      }
    ],
    [
      "OpenAutoMarket/ownable",
      {
        name: "AutoMarket",
        description:
          "AutoMarket ownable OpenNFTs Collection: own your collection, mint and sell your NFTs with royalties",
        icon: "dollar-sign",
        network: "all"
      }
    ]
  ]);

  const templateSplit = (templateKey: string) => templateKey.split("/");
  const templateName = (templateKey: string) => templateSplit(templateKey)[0];
  const templateConfig = (templateKey: string) => templateSplit(templateKey)[1];
</script>

<div class="section">
  <div class="titre">Choose your Collection type</div>
  <div class="box-fields">
    {#each [...templates] as [templateKey, templateValue]}
      {#if templateValue.network === "all"}
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

  <div class="description">
    <p>
      <i>
        {templates.get(template)?.description || ""}
      </i>
    </p>
  </div>
</div>

<style>
  :global(.admin-bar .modal-body input[type="checkbox"].collection-type:checked:before) {
    margin: 0;
    top: 50%;
  }
</style>
