<script lang="ts">
  import { ens } from "@lib/common/ens-get";
  export let account: string;
</script>

{#await ens.getName(account)}
  {account}
{:then accountEns}
  {accountEns}
{/await}
