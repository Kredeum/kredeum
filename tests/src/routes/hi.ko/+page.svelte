<script lang="ts">
	import { onMount } from 'svelte';
	import { sepolia, holesky } from 'viem/chains';
	import { getContract, type Address, type GetContractReturnType } from 'viem';

	import chains from '@providers/chains';
	import call from '@providers/call';
	import send from '@providers/send';
 
	chains.set([sepolia, holesky]);

	const chainId = 11155111;
	const addresses = {
		'11155111': {
			Hi: '0x47975ba3c3A66683de3EF351Fe40966FF743BAaA',
			chainName: 'sepolia'
		},
		'17000': {
			Hi: '0x5C99e5789E6de95e26155A9FC1a85AC2B434A08A',
			chainName: 'holesky'
		}
	};

	const abi = [
		{
			type: 'function',
			name: 'getHi',
			inputs: [],
			outputs: [{ name: 'hi_', type: 'string', internalType: 'string' }],
			stateMutability: 'view'
		},
		{
			type: 'function',
			name: 'setHi',
			inputs: [{ name: 'hi_', type: 'string', internalType: 'string' }],
			outputs: [],
			stateMutability: 'nonpayable'
		}
	];

	let hi = '';

	const main = async () => {
		const publicClient = call.getPublicClient(chainId);
		const address = addresses[chainId].Hi as Address;
		const readContract = getContract({ abi, address, client: { public: publicClient } });
		const readHi = async () => (hi = (await readContract.read.getHi()) as string);

		const walletClient = await send.getWalletClient(chainId);
		const writeContract = getContract({
			abi,
			address,
			client: { public: publicClient, wallet: walletClient }
		});
		const writeHi = async () => await writeContract.write.setHi(['Hi!']);

		await readHi();
		await writeHi();
		await readHi();
	};

	main();
</script>

<h1>Hi Test</h1>

hi='{hi}'
