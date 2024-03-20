import { defineChain } from 'viem';

const anvil = defineChain({
	id: 31_337,
	name: 'Anvil',
	network: 'anvil',
	nativeCurrency: {
		decimals: 18,
		name: 'Local Ether',
		symbol: 'lETH'
	},
	rpcUrls: {
		default: { http: ['http://127.0.0.1:8545'] },
		public: { http: ['http://127.0.0.1:8545'] }
	},
	blockExplorers: {
		default: {
			name: 'No explorer',
			url: ''
		}
	}
});

export { anvil };
