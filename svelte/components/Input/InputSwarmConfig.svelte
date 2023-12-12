<script lang="ts">
	import { fade, fly } from 'svelte/transition';
	import { quintOut, bounceOut } from 'svelte/easing';

	/////////////////////////////////////////////////
    // <InputSwarmConfig bind:apiEndpoint bind:apiKey />
    // Dapp Modale to set the storage config
    /////////////////////////////////////////////////
	export let apiEndpoint: string;
    export let apiKey: string;

	let errMessage = '';
	let successMessage = '';

	$: swarmApi = apiEndpoint;
	$: batchId = apiKey;

	const isUrlValid = (url: string): boolean => {
		if (!url) return false;
		try {
			new URL(url);
			return true;
		} catch (e) {
			return false;
		}
	};

	const isBatchIdValid = (batchId: string): boolean => {
		return batchId.replace(/^0x/, '').length === 64;
	};

	const resetMessages = () => {
		errMessage = '';
		successMessage = '';
	};

	const storeUserSettings = (): void => {
		resetMessages();

		swarmApi = swarmApi.trim().replace(/\/$/, '');
		if (!isUrlValid(swarmApi)) {
			errMessage = `Invalid node URL '${swarmApi}'`;
			swarmApi = apiEndpoint;
			return;
		}
		apiEndpoint = swarmApi

		batchId = batchId?.trim() || null;
		batchId = batchId?.replace(/^0x/, '') || null;
		if (batchId !== null) batchId = `0x${batchId}`;
		if (!(batchId && isBatchIdValid(batchId))) {
			errMessage = `Invalid batchId '${batchId}'`;
			batchId = apiKey;
			return;
		}
		apiKey = batchId;

		successMessage = 'Swarm config stored';
		setTimeout(() => resetMessages(), 2000);
	};
</script>

<section id="swarm-config">
	<h2>Config</h2>

	<label class="input-label" for="swarm-api">Bee node URL</label>
	<input
		type="text"
		class="input-field kre-field-outline"
		placeholder="Enter your bee node URL"
		bind:value={swarmApi}
		id="swarm-api"
		on:input={resetMessages}
	/>

	<label class="input-label" for="batch-id">BatchID</label>
	<input
		type="text"
		class="input-field kre-field-outline"
		placeholder="Enter your batch ID"
		bind:value={batchId}
		id="batch-id"
		on:input={resetMessages}
	/>

	<input
		type="submit"
		on:click|preventDefault={storeUserSettings}
		class="btn btn-submit"
		value="Store Swarm config"
	/>
	{#if errMessage}
		<p
			class="error-message"
			in:fly={{ delay: 0, duration: 300, x: 0, y: 100, opacity: 0.5, easing: bounceOut }}
			out:fade={{ duration: 300 }}
		>
			Ooops, {errMessage}
		</p>
	{:else if successMessage}
		<p
			class="success-message"
			in:fly={{ delay: 0, duration: 300, x: 0, y: 100, opacity: 0.5, easing: quintOut }}
			out:fade={{ duration: 300 }}
		>
			{successMessage}
		</p>
	{/if}
</section>

<style>
	#swarm-config {
		display: flex;
		flex-direction: column;
		align-content: center;
		align-items: center;
		flex-wrap: wrap;
		min-height: 28em;
	}

	.input-label {
		font-weight: 700;
		margin-bottom: 1em;
	}

	.input-field {
		margin-bottom: 3em;
		color: #2f2f49;
	}

	.input-field:focus {
		outline-color: #3acf6e;
		outline-style: outset;
		outline-width: 2px;
	}

	.btn-submit {
		background: #3acf6e;
    	color: #fff;
	}

	.error-message {
		color: red;
	}

	.success-message {
		color: chartreuse;
	}
</style>