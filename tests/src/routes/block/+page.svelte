<script lang="ts">
	import chains from '@providers/chains';
	import call from '@providers/call';
	import { onDestroy, onMount } from 'svelte';

	import { mainnet, optimism, polygon, bsc } from 'viem/chains';

	let blockNumber: bigint | null;
	let blockNumbers: bigint[] = [];

	chains.set([mainnet, optimism, polygon, bsc]);
	const pc = call.getPublicClient(1);

	const unwatch = pc.watchBlockNumber({
		onBlockNumber: (number) => (blockNumber = number)
	});

	onMount(async () => {
		blockNumbers[0] = await call.getBlockNumber(1);
		blockNumbers[1] = await call.getBlockNumber(137);
		blockNumbers[2] = await call.getBlockNumber(56);
		blockNumbers[3] = await call.getBlockNumber(10);
	});

	onDestroy(() => {
		unwatch();
	});
</script>

<h1>Tests Blocks</h1>

<p>Block Number Mainnet: {blockNumber || '#######'}</p>

{#each blockNumbers as blockNumber, i}
	<p>Block Number #{i}: {blockNumber || '#######'}</p>
{/each}

{chains.getName(10)}
