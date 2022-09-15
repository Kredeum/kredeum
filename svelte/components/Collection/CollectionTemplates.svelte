<script lang="ts">
  export let template = "OpenNFTsV4/ownable";

  const templates = new Map([
    [
      "OpenNFTsV4/ownable",
      {
        name: "Ownable",
        description: "Ownable NFTs Collection: own your Collection, only you can Mint NFTs",
        icon: "user"
      }
    ],
    [
      "OpenNFTsV4/generic",
      {
        name: "Generic",
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
    ]
  ]);

  $: console.log("template", template);
</script>

<div class="section">
  <div class="titre">Choose your Collection type</div>
  <div class="box-fields">
    {#each [...templates] as [key, value]}
      <input
        class="box-field collection-type"
        id="collection-type-{key}"
        name="collection-type"
        type="radio"
        value={value.name}
        data-toggle="tooltip"
        title={value.description}
        checked={key == template}
        on:click={() => (template = key)}
      />
      <label class="field" for="collection-type-{key}"><i class="fas fa-{value.icon}" />{value.name}</label>
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
