<script>
    let collectionAddress;

    const resolverAddCollectin = () => {
        
    }
</script>

<div class="titre add-collection-address">Add custom collection</div>
<div class="form-field">
  <input type="text" class=" kre-field-outline" placeholder="add collection address" bind:value={collectionAddress} />
  <button type="submit" class="btn btn-default btn-sell" on:click|preventDefault={resolverAddCollectin}>Add</button>
</div>

<style>
  .form-field {
    display: grid;
    grid-template-columns: auto min-content;
  }
</style>
