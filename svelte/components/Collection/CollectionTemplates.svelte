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
      "OpenNFTsV4/automarket",
      {
        name: "AutoMarket",
        description: "AutoMarket NFTs Collection, sell your NFTs with royalties",
        icon: "dollar-sign"
      }
    ]
  ]);

  const _templateSet = (tmpl: string): void => {
    console.info("_templateSet", tmpl, template);
    template = tmpl;
  };
</script>

<div class="section">
  <span class="label label-big">Collection type</span>
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
        on:click={() => _templateSet(key)}
      />
      <label class="field" for="collection-type-{key}"><i class="fas fa-{value.icon}" />{value.name}</label>
    {/each}
  </div>
  <div class="description">
    <p>
      <i>
        {#if templates.get(template)}
          {templates.get(template).description}
        {/if}
      </i>
    </p>
  </div>
</div>
