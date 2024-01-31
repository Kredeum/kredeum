import type { Readable } from 'svelte/store';
import { derived } from 'svelte/store';

import type { CollectionType } from '@kredeum/common/lib/common/types';
import { collectionList as collectionListLib } from '@kredeum/common/lib/collection/collection-list';
import { collectionGet as collectionLib } from '@kredeum/common/lib/collection/collection-get';

import {
	collectionStore,
	collectionStoreSet
} from '@kredeum/sveltekit/src/lib/stores/collection/collection';
import { keyCollectionDefault, collectionDefaultStore } from './collectionDefault';
import { collectionListStore } from './collectionList';

// STATE VIEW : GET Collection fitered list
const collectionSubListStore = (
	chainId: number,
	account?: string,
	address?: string,
	mintable = false
): Readable<Map<string, CollectionType>> => {
	// console.log(`collectionSubListStore ${keyCollections(chainId, account, address, mintable)}\n`);

	return derived(
		[collectionListStore, collectionDefaultStore],
		([$collectionListStore, $collectionDefaultStore]) => {
			const [collectionDefault, collectionMintableDefault] = $collectionDefaultStore.get(
				keyCollectionDefault(chainId, account)
			) || ['', ''];

			const collections = new Map(
				[...$collectionListStore]
					.filter(([, coll]) => {
						// const okParams = chainId > 0;
						const okParams = chainId > 0 && Boolean(account);

						// NETWORK
						const okNetwork = coll.chainId === chainId;

						// ADDRESS
						const okAddress = coll.address === address;

						// BALANCE
						const okBalance = (coll.balancesOf?.get(account) || 0) > 0;

						// OWNER
						const okOwner = coll.owner === account;

						// DEFAULT MINTABLE
						const okMintableDefault = coll.address == collectionMintableDefault;

						// MINTABLE
						const okMintable = okMintableDefault || coll.open || (okOwner && coll.version >= 3);

						// DEFAULT
						const okDefault = coll.address == collectionDefault || okMintableDefault;

						// FILTER
						const okFilter =
							(okAddress || okOwner || okBalance || okDefault) && (!mintable || okMintable);

						// IERC1155
						// const okIrc1155 = collectionIsERC1155(coll);

						return okParams && okNetwork && okFilter;
					})

					// SORT PER SUPPLY DESC
					.sort(
						([, a], [, b]) => (b.balancesOf?.get(account) || 0) - (a.balancesOf?.get(account) || 0)
					)
			);
			// console.log("collectionSubListStore collections", collections);
			return collections;
		}
	);
};

// ACTIONS : Refresh all Collections from one nework, from an optional account
const collectionSubListRefresh = async (
	chainId: number,
	account?: string,
	address?: string,
	mintable = false
): Promise<void> => {
	if (!chainId) return;

	const colls = await collectionListLib(chainId, account, mintable);
	for (const collectionObject of colls.values()) {
		collectionStoreSet(collectionObject);
	}
	if (!colls.has(address)) {
		collectionStoreSet(await collectionLib(chainId, address));
	}
	// console.log(`collectionSubListRefresh ${keyCollections(chainId, account, mintable)}\n`, colls);
};

export { collectionSubListStore, collectionSubListRefresh };
