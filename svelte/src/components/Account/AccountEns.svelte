<script lang="ts">
  import { Address } from "viem";
  import { ens } from "@common/common/ens-get";
  export let account: Address;
  export const accountName: string | undefined = undefined;
</script>

{#await ens.getName(account)}
  {account}
{:then accountName}
  {accountName}
{/await}
