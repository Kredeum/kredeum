<script lang="ts">
  export let mainContentDisplayComponent: string = "grid";
</script>

<div class="col col-xs-12 col-sm-3">
  <div class="box-fields">
    <input
      bind:group={mainContentDisplayComponent}
      class="box-field"
      id="display-grid-type"
      name="nfts-display-type"
      type="radio"
      value="grid"
    />
    <label class="field" for="display-grid-type"><i class="fas fa-th" />Grid</label>

    <input
      bind:group={mainContentDisplayComponent}
      class="box-field"
      id="display-list-type"
      name="nfts-display-type"
      type="radio"
      value="list"
    />
    <label class="field" for="display-list-type"><i class="fas fa-list" />List</label>
  </div>
</div>
