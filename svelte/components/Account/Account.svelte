<script lang="ts">
  import { getShortAddress, blockscanUrl, getEnsName } from "@lib/kconfig";

  /////////////////////////////////////////////////
  // <AccountConnect {account} {txt} />
  // Display Account
  /////////////////////////////////////////////////
  export let account: string;
  export let txt: boolean = undefined;

  let accountEns: string;
  const _getEnsName = async (_account: string): Promise<string> => (accountEns = await getEnsName(_account));
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
      title="&#009;Owner address (click to view account in explorer )&#013;{accountEns}"
      ><i class="fas fa-info-circle" /></a
    >
  </span>
  <div class="form-field">
    <input type="text" value={getShortAddress(accountEns, 10)} />
  </div>
{/if}
