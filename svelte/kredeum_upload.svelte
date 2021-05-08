<svelte:options tag="kredeum-upload" immutable="{true}" />

<script>
  let avatar, fileinput;

  const onFileSelected = (e) => {
    let image = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = (e) => {
      avatar = e.target.result;
    };
  };
</script>

<div class="cadre">
  <div>
    <h3>Image <button on:click="{() => fileinput.click()}">Upload</button></h3>
  </div>

  <div class="box-image">
    {#if avatar}
      <kredeum-nft-mint height="100" src="{avatar}"></kredeum-nft-mint>
    {/if}
  </div>

  <div
    class="chan"
    on:click="{() => {
      fileinput.click();
    }}"
  ></div>
  <input
    style="display:none"
    type="file"
    accept=".jpg, .jpeg, .png"
    on:change="{(e) => onFileSelected(e)}"
    bind:this="{fileinput}"
  />
</div>

<style>
  .box-image {
    height: 180px;
    width: 240px;
  }
</style>
