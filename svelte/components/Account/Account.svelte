<script lang="ts">
  import { ensGetName } from "@lib/common/ens-get";
  import { getShortAddress, blockscanUrl } from "@lib/common/config";

  import CopyRefItem from "../Global/CopyRefItem.svelte";

  /////////////////////////////////////////////////
  // <AccountConnect {account} {txt} />
  // Display Account
  /////////////////////////////////////////////////
  export let account: string;
  export let txt: boolean = undefined;

  let accountEns: string;
  const _getEnsName = async (_account: string): Promise<string> => (accountEns = await ensGetName(_account));
  $: if (account) {
    accountEns = account;
    _getEnsName(account).catch(console.error);
  }
</script>

{#if txt}
  Address
  {accountEns}
{:else}
  <span class="label"
    >Address
    <a
      class="info-button"
      href={blockscanUrl(`/address/${account}`)}
      target="_blank"
      rel="noreferrer"
      title="&#009;Owner address (click to view account in explorer )&#013;{accountEns}"
      ><i class="fas fa-info-circle" /></a
    >
    <CopyRefItem copyData={account} />
  </span>

  <div class="form-field">
    <input type="text" value={getShortAddress(accountEns, 10)} />
  </div>
{/if}
