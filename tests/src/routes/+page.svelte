<script lang="ts">
	import { callBlockNumber, callPublicClient } from '@providers/call';
	import { onDestroy, onMount } from 'svelte';

	let block: bigint | null;

	const pc = callPublicClient(1);

	const unwatch = pc.watchBlockNumber({
		onBlockNumber: (blockNumber) => (block = blockNumber)
	});

	onDestroy(() => {
		unwatch();
	});
</script>

<h1>Tests</h1>

<p>Block Number Mainnet: {block || '#######'}</p>
