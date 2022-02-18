<script lang="ts">
  export let template = "ownable";

  const templates = new Map([
    [
      "ownable",
      {
        name: "Ownable",
        description: "Ownable NFTs Collection: own your Collection, only you can Mint NFTs",
        icon: "user"
      }
    ],
    [
      "generic",
      {
        name: "Generic",
        description: "Generic NFTs Collection: anyone can Mint NFTs",
        icon: "building"
      }
      // ],
      // [
      //   "fixedprice",
      //   {
      //     name: "FixedPrice",
      //     description: "FixedPrice NFTs Collection, sell your NFT at a fixed price you decide",
      //     icon: "dollar-sign"
      //   }
    ]
  ]);

  const _setTemplate = (tmpl: string): void => {
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
        on:click={() => _setTemplate(key)}
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
