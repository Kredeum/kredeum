<script lang="ts">
  import { getEnsName } from "lib/kconfig";
  export let account: string;
</script>

{#await getEnsName(account)}
  {account}
{:then accountEns}
  {accountEns}
{/await}
