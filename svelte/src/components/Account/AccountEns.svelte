<script lang="ts">
  import { ens } from "@common/common/ens-get";
  export let account: string;
  export const accountName: string | undefined = undefined;
</script>

{#await ens.getName(account)}
  {account}
{:then accountName}
  {accountName}
{/await}
