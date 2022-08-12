import { Provider } from "@ethersproject/abstract-provider";
import type { CollectionType, CollectionSupports, ABIS } from "./ktypes";
import { isProviderOnChainId, collectionKey } from "./kconfig";

import { Contract } from "ethers";

const collectionGetOtherDataOld = async (
  chainId: number,
  address: string,
  provider: Provider,
  collection: CollectionType,
  account?: string
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
    const abiQuery = [
      "function open() view returns (bool)",
      "function burnable() view returns (bool)",
      "function name() view returns (string)"
    ];
    const contract: QueryContract = new Contract(address, abiQuery, provider) as QueryContract;

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

      if (supports.IOpenNFTsV4) {
        collection.burnable = true;
        collection.open = await contract.open();
        collection.version = 4;
      } else if (supports.IOpenNFTsV3) {
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

export { collectionGetOtherDataOld };
