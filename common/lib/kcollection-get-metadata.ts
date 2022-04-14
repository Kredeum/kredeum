import { Provider } from "@ethersproject/abstract-provider";
import type { CollectionSupports, ABIS } from "./ktypes";
import { interfaceId, isProviderOnChainId } from "./kconfig";

import { Contract } from "ethers";

import IERC165 from "abis/IERC165.json";
import IERC721 from "abis/IERC721.json";
import IERC721Enumerable from "abis/IERC721Enumerable.json";
import IERC721Metadata from "abis/IERC721Metadata.json";
import IERC1155 from "abis/IERC1155.json";
import IERC1155MetadataURI from "abis/IERC1155MetadataURI.json";
import IERC173 from "abis/IERC173.json";

import IOpenNFTsV2 from "abis/IOpenNFTsV2.json";
import IOpenNFTsV3 from "abis/IOpenNFTsV3.json";

interface MetadataType {
  supports: CollectionSupports;
  version?: number;
  open?: boolean;
  owner?: string;
  name?: string;
  symbol?: string;
  totalSupply?: number;
  balancesOf?: Map<string, number>;
}

const collectionGetMetadata = async (
  chainId: number,
  address: string,
  provider: Provider,
  account?: string
): Promise<MetadataType> => {
  if (!(chainId && address && (await isProviderOnChainId(provider, chainId)))) return { supports: {} };

  console.log(`collectionGetMetadata collection://${chainId}/${address}\n`);

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
  const supports: CollectionSupports = {};
  const version = -1;
  let open = false;
  let owner = "";
  let name = "";
  let symbol = "";
  let totalSupply = 0;
  let balanceOf = -1;

  interface TestContract extends Contract {
    supportsInterface: (ifaces: string) => Promise<boolean>;
    owner: () => Promise<string>;
    name: () => Promise<string>;
    symbol: () => Promise<string>;
    totalSupply: () => Promise<number>;
    balanceOf: (account: string) => Promise<number>;
    open: () => Promise<boolean>;
  }

  // Suppose supports ERC165, should revert otherwise
  supports.IERC165 = true;

  try {
    const contract: TestContract = new Contract(
      address,
      IERC165.concat(IERC173).concat(IERC721).concat(IERC721Metadata).concat(IERC721Enumerable).concat(IOpenNFTsV3),
      provider
    ) as TestContract;

    try {
      const waitERC721 = contract.supportsInterface(interfaceId(IERC721));
      const waitERC1155 = contract.supportsInterface(interfaceId(IERC1155));
      const waitERC173 = contract.supportsInterface(interfaceId(IERC173));
      [supports.IERC721, supports.IERC1155, supports.IERC173] = await Promise.all([
        waitERC721,
        waitERC1155,
        waitERC173
      ]);

      if (supports.IERC721) {
        const waitMetadata = contract.supportsInterface(interfaceId(IERC721Metadata));
        const waitEnumerable = contract.supportsInterface(interfaceId(IERC721Enumerable));
        const waitOpenNFTsV2 = contract.supportsInterface(interfaceId(IOpenNFTsV2));
        const waitOpenNFTsV3 = contract.supportsInterface(interfaceId(IOpenNFTsV3));

        [supports.IERC721Metadata, supports.IERC721Enumerable, supports.IOpenNFTsV2, supports.IOpenNFTsV3] =
          await Promise.all([waitMetadata, waitEnumerable, waitOpenNFTsV2, waitOpenNFTsV3]);
      } else if (supports.IERC1155) {
        supports.IERC1155MetadataURI = await contract.supportsInterface(interfaceId(IERC1155MetadataURI));
      }

      if (supports.IOpenNFTsV3) {
        supports.IOpenNFTs = true;
        open = await contract.open();
      } else if (supports.IOpenNFTsV2) {
        supports.IOpenNFTsV2 = true;
      } else if (openNFTsV1Addresses.includes(contract.address)) {
        supports.IOpenNFTsV1 = true;
      } else if (openNFTsV0Addresses.includes(contract.address)) {
        supports.IOpenNFTsV0 = true;
      }

      // Get balanceOf account (IERC721)
      if (supports.IERC721 && account) {
        balanceOf = Number(await contract.balanceOf(account));
      }

      // Get totalSupply and symbol (IERC721Enumerable)
      if (supports.IERC721Enumerable) {
        totalSupply = Number(await contract.totalSupply());
      }

      // Get owner (ERC173) or OpenNFTsV2
      if (supports.IERC173 || supports.IOpenNFTsV2) {
        owner = await contract.owner();
      }

      // Get name and symbol (IERC721Metadata), try it if IERC1155... may revert as not normalized
      if (supports.IERC721Metadata) {
        name = await contract.name();
        symbol = await contract.symbol();
      }
    } catch (err) {
      console.info(
        `ERROR collectionGetMetadata @ collection://${chainId}/${address}\n`,
        await isProviderOnChainId(provider, chainId),
        JSON.stringify(err)
      );
    }

    try {
      // Get name and symbol ... try it if IERC1155... may revert as not normalized
      if (supports.IERC1155) {
        name = await contract.name();
        symbol = await contract.symbol();
      }
    } catch (err) {
      console.log("ERC1155 collection with no name and symbol");
    }
  } catch (err) {
    console.log(`No contract found @ collection://${chainId}/${address}\n`);
  }

  // delete too much supports=false
  for (const key in supports) if (!supports[key as ABIS]) delete supports[key as ABIS];

  const collectionMetadata: MetadataType = { supports };
  if (version) collectionMetadata.version = version;
  if (open) collectionMetadata.open = open;
  if (owner) collectionMetadata.owner = owner;
  if (name) collectionMetadata.name = name;
  if (symbol) collectionMetadata.symbol = symbol;
  if (totalSupply) collectionMetadata.totalSupply = totalSupply;
  if (balanceOf >= 0 && account) collectionMetadata.balancesOf = new Map([[account, balanceOf]]);

  // console.log("collectionGetMetadata", collectionMetadata);
  return collectionMetadata;
};

export { collectionGetMetadata };
