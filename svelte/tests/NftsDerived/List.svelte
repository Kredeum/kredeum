<script>
  export let arr = [];
  export let label = "";
</script>

<h2>{label} #{arr.length}</h2>
{#each arr as [key, val]}
  <p>
    {key} = {JSON.stringify(val)}
  </p>
{/each}
