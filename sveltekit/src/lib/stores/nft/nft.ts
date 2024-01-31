import type { Readable } from 'svelte/store';
import { derived, get } from 'svelte/store';

import type { NftType } from '@kredeum/common/lib/common/types';
import { nftGet } from '@kredeum/common/lib/nft/nft-get';

import { nftListStore } from './nftList';

import { constants } from 'ethers';
import { isAddressNotZero } from '@kredeum/common/lib/common/config';
import { keyCollection, keyNft } from '@kredeum/common/lib/common/keys';
import { collectionListStore } from '@kredeum/sveltekit/src/lib/stores/collection/collectionList';
import { jsonMapStringify } from '@kredeum/sveltekit/src/lib/helpers//jsonMap';
import { localStorageRemove, localStorageSet } from '@kredeum/common/lib/common/local';

const nftStoreSet = (nft: NftType): void => {
	const { chainId, address, tokenID } = nft || {};
	// console.log("nftStoreSet", chainId, address, tokenID);
	if (!(chainId && address && address != constants.AddressZero && tokenID)) return;

	nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
		const key = keyNft(chainId, address, tokenID);

		localStorageSet(key, jsonMapStringify(nft));

		return $nftListStore.set(key, nft);
	});
};

// ACTIONS : REFRESH one Nft
const nftStoreRefresh = async (
	chainId: number,
	address: string,
	tokenID: string
): Promise<void> => {
	// console.log("nftStoreRefresh", chainId, address, tokenID);
	if (!(chainId && isAddressNotZero(address) && tokenID)) return;

	const _coll = get(collectionListStore).get(keyCollection(chainId, address));
	// console.log("nftStoreRefresh ~ _coll", _coll);

	try {
		const _nftOld = get(nftListStore).get(keyNft(chainId, address, tokenID)) || {};
		const _nftLib = await nftGet(chainId, address, tokenID, _coll, true);

		const _nftNew = Object.assign(_nftOld, _nftLib);

		nftStoreSet(_nftNew);
	} catch (err) {
		console.info('nftStoreRefresh known', err);
	}
};

// STATE VIEW : one Nft store
const nftStore = (chainId: number, address: string, tokenID: string): Readable<NftType> =>
	derived(nftListStore, ($nftListStore) => $nftListStore.get(keyNft(chainId, address, tokenID)));

// Remove one nft from store & localstorage
const nftStoreRemove = (chainId: number, address: string, tokenID: string) => {
	if (!(chainId && address && address != constants.AddressZero && tokenID)) return;

	nftListStore.update(($nftListStore: Map<string, NftType>): Map<string, NftType> => {
		const keyToRemove = keyNft(chainId, address, tokenID);

		localStorageRemove(keyToRemove);

		return ($nftListStore = new Map([...$nftListStore].filter(([key]) => key != keyToRemove)));
	});
};

const nftStoreAndRefresh = (
	chainId: number,
	address: string,
	tokenID: string
): Readable<NftType> => {
	if (!(chainId && address && address != constants.AddressZero && tokenID)) return;

	// STATE VIEW : sync read cache
	const nft = nftStore(chainId, address, tokenID);

	// ACTION : async refresh from lib onchain data
	nftStoreRefresh(chainId, address, tokenID).catch(console.error);

	return nft;
};

export { nftStore, nftStoreRefresh, nftStoreAndRefresh, nftStoreSet, nftStoreRemove };
