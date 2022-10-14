<script lang="ts">
  /////////////////////////////////////////////////
  // <CopyRefItem {copyData} />
  //  Display icon to copy reference
  /////////////////////////////////////////////////
  export let copyData: string;

  const copyToClipboard = async (data): Promise<void> => {
    await navigator.clipboard.writeText(data).catch(() => console.error("Not copied"));
  };
</script>

<i class="fa fa-clone copy-ref" on:click|preventDefault={() => copyToClipboard(copyData)} aria-hidden="true" />

<style>
  .copy-ref {
    vertical-align: baseline;
    color: grey;
  }
</style>
