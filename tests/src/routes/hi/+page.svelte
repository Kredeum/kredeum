<script lang="ts">
	import { onMount } from 'svelte';
	import { sepolia, holesky } from 'viem/chains';
	import {
		type Address,
		type GetContractReturnType,
		createPublicClient,
		createWalletClient,
		custom,
		http,
		getContract
	} from 'viem';
	import 'viem/window';

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
	const message1 = 'In Kredem, we Trust!';
	const message2 = 'We Trust in Kredem!';
	let hi = '';

	const main = async () => {
		const publicClient = createPublicClient({
			chain: sepolia,
			transport: http()
		});
		const address = addresses[chainId].Hi as Address;
		const readContract = getContract({ abi, address, client: { public: publicClient } });
		const readHi = async (): Promise<string> => (await readContract.read.getHi()) as string;
		hi = await readHi();
		console.log('main ~ hi:', hi);

		const [account] = await window.ethereum!.request({
			method: 'eth_requestAccounts'
		});
		console.log('main ~ account:', account);

		const walletClient = createWalletClient({
			account,
			chain: sepolia,
			transport: custom(window.ethereum!)
		});
		const writeContract = getContract({
			abi,
			address,
			client: { wallet: walletClient }
		});
		const writeHi = async (message: string) => await writeContract.write.setHi([message]);

		const hash = await writeHi(hi == message2 ? message1 : message2);
		console.log('main ~ hash:', hash);

		const transactionReceipt = await publicClient.waitForTransactionReceipt({ hash });
		console.log("main ~ transactionReceipt:", transactionReceipt);

    hi = await readHi();
		console.log('main ~ hi:', hi);
	};

	onMount(() => {
		main();
	});
</script>

<h1>Hi Test</h1>

hi='{hi}'
