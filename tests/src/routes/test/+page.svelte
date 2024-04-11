<script lang="ts">
	import callResolver from '@kredeum/common/src/contract/callResolver';


	import chains from '@kredeum/providers/src/chains';
	import { mainnet } from 'viem/chains';

	chains.set([mainnet]);
	console.log('chains set');
</script>

{#await callResolver.getBlockNumber(1)}
	<p>loading...</p>
{:then res}
	<p>
		{res}
	</p>
{:catch err}
	<p>ERROR {err.message}</p>
{/await}
