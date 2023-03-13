<script lang="ts">
  export let mode: string = "grid";
</script>

<div id="displayListMode" class="col col-xs-12 col-sm-5">
  <div class="box-fields">
    <input
      bind:group={mode}
      class="box-field"
      id="display-grid-type"
      name="nfts-display-type"
      type="radio"
      value="grid"
    />
    <label class="field" for="display-grid-type"><i class="fas fa-th" /></label>

    <input
      bind:group={mode}
      class="box-field"
      id="display-list-type"
      name="nfts-display-type"
      type="radio"
      value="list"
    />
    <label class="field" for="display-list-type"><i class="fas fa-list" /></label>
  </div>
</div>

<style>
  #displayListMode {
    float: right;
    text-align: right;
    padding: 0;
  }

  #displayListMode .box-fields .field i {
    margin: 0;
  }
</style>
