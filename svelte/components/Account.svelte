<script lang="ts">
  import { getShortAddress, explorerAccountUrl, getEnsName, getChainName } from "lib/kconfig";

  export let txt: boolean = undefined;
  export let account: string;
  export let chainId: number;

  let accountEns: string;
  const _getEnsName = async (_account) => (accountEns = await getEnsName(_account));
  $: if (account) {
    accountEns = account;
    _getEnsName(account);
  }

  $: chainName = getChainName(chainId);
</script>

{#if txt}
  {accountEns}@{chainName}
{:else}
  <span class="label"
    >Address
    <a
      class="info-button"
      href={explorerAccountUrl(chainId, account)}
      target="_blank"
      title="&#009;Owner address (click to view account in explorer )&#013;{accountEns}"
      ><i class="fas fa-info-circle" /></a
    >
  </span>
  <div class="form-field">
    <input type="text" value={getShortAddress(accountEns, 10)} />
  </div>
{/if}
