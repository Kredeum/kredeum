import { Readable } from "svelte/store";
import { derived } from "svelte/store";
import { collectionList } from "stores/collectionList";
import { Collection as CollectionType } from "lib/ktypes";

// STATE VIEW : GET Collection fitered list
export const collectionListFilter = (
  chainId: number,
  account: string,
  mintable = false
): Readable<Map<string, CollectionType>> =>
  derived(
    collectionList,
    ($collectionList) =>
      new Map(
        [...$collectionList]
          .filter(([, coll]) => {
            const okParams = chainId && account;

            // SAME NETWORK
            const okNetwork = coll.chainId === chainId;

            // Collection IS a mintable collection that I own OR default mintable collection
            const okMintable = coll.owner === account && Boolean(coll.mintable);
            // || coll.address == collectionDefaultOpenNFTsGet(chainId);

            // When not wanting to Mint ALL collections I own OR where I have NFTs OR default collection
            const okAll = !mintable && (coll.owner === account || coll.balanceOf > 0 || coll.supports?.IERC1155);
            // || coll.address == collectionDefaultGet(chainId, account));

            const ok = okParams && okNetwork && (okMintable || okAll);
            // console.log(".filter", ok, okNetwork, okMintable, okAll, mintable, coll);

            return ok;
          })

          // )
          // SORT PER SUPPLY DESC
          .sort(([, a], [, b]) => b.balanceOf - a.balanceOf)
      )
  );
