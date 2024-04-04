<script lang="ts">
	import { onMount } from 'svelte';

	import 'viem/window';
	import type { WalletClient, PublicClient } from 'viem';
	import { createPublicClient, createWalletClient, custom } from 'viem';


	let client: PublicClient;
	let walletClient: WalletClient;

	let account: `0x${string}`;
	let chainId: number;
	let minting: boolean = false;

	$: console.log('account switch', account);
	$: console.log('chainId switch', chainId);

	onMount(async () => {
		if (typeof window.ethereum !== 'undefined') {

			client = createPublicClient({
				transport: custom(window.ethereum)
			});

			walletClient = createWalletClient({
				transport: custom(window.ethereum)
			});

			account = await getAddress();
			chainId = await client.getChainId();

			window.ethereum.on('accountsChanged', (_accounts: `0x${string}`[]) => {
				console.log('accounts:', _accounts);
				account = _accounts[0];
			});

			window.ethereum.on('chainChanged', (_chainId: string) => {
				// console.log('chainId Hex:', _chainId);
				chainId = parseInt(_chainId, 16);
				console.log('chainId:', chainId);
			});
		}
	});

	// VIEM
	const getAddress = async () => {
		const addresses = await walletClient.getAddresses();
		console.log('addresses:', addresses);
		console.log('address current:', addresses[0]);
		return addresses[0];
	};

	const getBalance = async () => {
		const balance = await client.getBalance({
			address: await getAddress()
		});
		console.log('🚀 ~ file: +page.svelte:75 ~ getBalance ~ balance:', balance);
		return balance;
	};

	const windowEthEnable = async () => {
		if (!account) {
			connectMetamask();
		}
	};

	const connectMetamask = async () => {
		if (typeof window.ethereum !== 'undefined') {
			[account] = await window.ethereum.request({ method: 'eth_requestAccounts' });
		}
	};
</script>

<h1>Test MetaMask Connexion</h1>

<div class="user-config">
	{#if !account}
		<button id="connect-metamask-button" class="btn-connect" on:click={connectMetamask}> Connect Metamask </button>
	{/if}

	<div class="provisory">
		<button on:click={getAddress}>get address</button>
		<button on:click={getBalance}>get balance</button>
	</div>

	{#if account}
		<p class="field-account">{account}</p>
		<p class="field-account">Chain ID : {chainId}</p>
	{/if}
</div>

<p><a href="..">Home</a></p>
