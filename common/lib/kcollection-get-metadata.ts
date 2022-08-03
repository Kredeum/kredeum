import { Provider } from "@ethersproject/abstract-provider";
import type { CollectionType, CollectionSupports, ABIS } from "./ktypes";
import { interfaceId, isProviderOnChainId, collectionKey } from "./kconfig";
import { collectionGetSupportsCheckable } from "./kcollection-get-metadata-checkable";

import { Contract } from "ethers";

import { abis } from "lib/kabis";

import type { IERC165 } from "soltypes/contracts/interfaces/IERC165";

import Semaphore from "semaphore-async-await";

const openNFTsV0Addresses = [
  "0xF6d53C7e96696391Bb8e73bE75629B37439938AF", // matic
  "0x792f8e3C36Ac3c1C6D62ECc44a88cA1317fEce93" // matic
];
const openNFTsV1Addresses = [
  "0x82a398243EBc2CB26a4A21B9427EC6Db8c224471", // mainnet
  "0xbEaAb0f00D236862527dcF5a88dF3CEd043ab253", // matic
  "0xC9D75c6dC5A75315ff68A4CB6fba5c53aBed82d0", // matic
  "0xd9C43494D2b3B5Ae86C57d12eB7683956472d5E9" // Bsc
];

// Cache supports   (chainId, address)
const supportsCache: Map<string, CollectionSupports> = new Map();
const locks: Map<string, Semaphore> = new Map();

const collectionGetSupports = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType = { chainId, address }
): Promise<CollectionSupports> => {
  if (!(chainId && address && (await isProviderOnChainId(provider, chainId)))) return {};

  let supports: CollectionSupports | undefined;

  // console.log(`collectionGetSupports IN ${collectionKey(chainId, address)}`);

  const lockPrevious = locks.get(collectionKey(chainId, address));
  if (lockPrevious) {
    await lockPrevious.acquire();
    supports = supportsCache.get(collectionKey(chainId, address));
    lockPrevious.release();

    if (!supports?.IERC165) console.error("collectionGetSupports ERROR IERC165");
    return supports || {};
  }

  const lock = new Semaphore(1);
  locks.set(collectionKey(chainId, address), lock);
  await lock.acquire();

  supports = { IERC165: true };
  try {
    const contract = new Contract(address, abis["IERC165"], provider) as IERC165;
    const openCheckable = await contract.supportsInterface(interfaceId(abis["IOpenCheckable"]));

    if (openCheckable) {
      supports = await collectionGetSupportsCheckable(address, provider);
      supports.IOpenNFTs = true;
    } else {
      const waitERC721 = contract.supportsInterface(interfaceId(abis["IERC721"]));
      const waitERC1155 = contract.supportsInterface(interfaceId(abis["IERC1155"]));
      const waitERC173 = contract.supportsInterface(interfaceId(abis["IERC173"]));
      [supports.IERC721, supports.IERC1155, supports.IERC173] = await Promise.all([
        waitERC721,
        waitERC1155,
        waitERC173
      ]);

      if (supports.IERC721) {
        const waitMetadata = contract.supportsInterface(interfaceId(abis["IERC721Metadata"]));
        const waitEnumerable = contract.supportsInterface(interfaceId(abis["IERC721Enumerable"]));
        const waitOpenNFTsV2 = contract.supportsInterface(interfaceId(abis["IOpenNFTsV2"]));
        const waitOpenNFTsV3 = contract.supportsInterface(interfaceId(abis["IOpenNFTsV3"]));
        const waitOpenNFTsV4 = contract.supportsInterface(interfaceId(abis["IOpenNFTsV4"]));

        [
          supports.IERC721Metadata,
          supports.IERC721Enumerable,
          supports.IOpenNFTsV2,
          supports.IOpenNFTsV3,
          supports.IOpenNFTsV4
        ] = await Promise.all([waitMetadata, waitEnumerable, waitOpenNFTsV2, waitOpenNFTsV3, waitOpenNFTsV4]);

        // Supports ERC165,  should have already reverted otherwise

        if (supports.IOpenNFTsV3) supports.IOpenNFTs = true;
        else if (!supports.IOpenNFTsV2) {
          if (openNFTsV1Addresses.includes(contract.address)) {
            supports.IOpenNFTsV1 = true;
          } else if (openNFTsV0Addresses.includes(contract.address)) {
            supports.IOpenNFTsV0 = true;
          }
        }
      } else if (supports.IERC1155) {
        supports.IERC1155MetadataURI = await contract.supportsInterface(interfaceId(abis["IERC1155MetadataURI"]));
      }

      for (const key in supports) {
        if (!supports[key as ABIS]) delete supports[key as ABIS];
      }
    }
  } catch (err) {
    console.info(
      `ERROR collectionGetSupports @ ${collectionKey(chainId, address)}\n`,
      await isProviderOnChainId(provider, chainId),
      collection,
      err
    );
  }
  // console.log(`collectionGetSupports OUT ${collectionKey(chainId, address)}\n`, supports);

  supportsCache.set(collectionKey(chainId, address), supports);
  lock.release();

  return supports;
};

const collectionGetOtherData = async (
  chainId: number,
  address: string,
  provider: Provider,
  account?: string,
  collection: CollectionType = { chainId, address }
): Promise<CollectionType> => {
  if (!(chainId && address && collection.supports && (await isProviderOnChainId(provider, chainId)))) return collection;
  // console.log(`collectionGetOtherData ${collectionKey(chainId, address, account)}\n`);

  interface QueryContract extends Contract {
    owner: () => Promise<string>;
    name: () => Promise<string>;
    symbol: () => Promise<string>;
    totalSupply: () => Promise<number>;
    balanceOf: (account: string) => Promise<number>;
    burnable: () => Promise<boolean>;
    open: () => Promise<boolean>;
  }

  try {
    const contract: QueryContract = new Contract(
      address,
      abis["IERC173"]
        .concat(abis["IERC721"])
        .concat(abis["IERC721Metadata"])
        .concat(abis["IERC721Enumerable"])
        .concat(abis["IOpenNFTsV3"]),
      provider
    ) as QueryContract;

    // Get supports ref
    const supports: CollectionSupports = collection.supports;

    try {
      // Get balanceOf account (IERC721)
      if (supports.IERC721 && account) {
        collection.balancesOf ??= new Map();
        collection.balancesOf.set(account, Number(await contract.balanceOf(account)));
      }

      // Get totalSupply and symbol (IERC721Enumerable)
      if (supports.IERC721Enumerable) {
        collection.totalSupply = Number(await contract.totalSupply());
      }

      // Get owner (ERC173) or OpenNFTsV2
      if (supports.IERC173 || supports.IOpenNFTsV2) {
        collection.owner = await contract.owner();
      }

      // Get name and symbol (IERC721Metadata)
      if (supports.IERC721Metadata) {
        collection.name = await contract.name();
        collection.symbol = await contract.symbol();
      }

      if (supports.IOpenNFTsV3) {
        collection.burnable = await contract.burnable();
        collection.open = await contract.open();
        collection.version = 3;
      } else if (supports.IOpenNFTsV2) {
        collection.version = 2;
        collection.open = true;
      } else if (supports.IOpenNFTsV1) {
        collection.version = 1;
        collection.open = true;
      } else if (supports.IOpenNFTsV0) {
        collection.version = 0;
        collection.open = true;
      }
    } catch (err) {
      console.info(
        `ERROR collectionGetSupports @ ${collectionKey(chainId, address, account)}\n`,
        await isProviderOnChainId(provider, chainId),
        JSON.stringify(err)
      );
    }

    // Get name if IERC1155 ... may revert as not normalized
    if (supports.IERC1155) {
      try {
        collection.name = await contract.name();
      } catch (err) {
        console.log("ERC1155 collection with no name", collection);
      }
    }
    if (!collection.name) {
      // ENS smartcontract
      if (chainId === 1 && collection.address === "0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85") {
        collection.name = "ENS domains";
        collection.symbol = "ENS";
      }
    }
  } catch (err) {
    console.log(`No contract found @ ${collectionKey(chainId, address, account)}\n`);
  }

  // console.log(`collectionGetOtherData ${collectionKey(chainId, address, account)}\n`, collection);
  return collection;
};

export { collectionGetOtherData, collectionGetSupports };
