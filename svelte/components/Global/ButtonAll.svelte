<script lang="ts">
  /////////////////////////////////////////////////
  // <ButtonAll {all} />
  // Select All button
  /////////////////////////////////////////////////
  export let all: boolean;
  /////////////////////////////////////////////////
</script>

<button
  class="clear"
  on:click={() => (all = !all)}
  title="      {all ? 'Click to View My NFTs' : 'Click to View All NFTs'}"
>
  <i class="fas fa-{all ? 'user' : 'users'}" />
</button>
