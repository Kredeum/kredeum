import { ethers, BigNumber, utils, Signer, Contract as ContractEthers } from "ethers";
import { fetchCov, fetchGQL } from "./kfetch";
import { abis, getNetwork, getProvider, getSubgraphUrl, getCovalent, nftsUrl } from "./kconfig";
import type { Network, Contract } from "./kconfig";
import type { NFTsFactory } from "../solidity/artifacts/types/NFTsFactory";
import type { Provider } from "@ethersproject/abstract-provider";

function getNFTsFactory(chainId: number, _providerOrSigner?: Signer | Provider): NFTsFactory {
  // console.log("getNFTsFactory", chainId);
  let nftsFactory: NFTsFactory;

  const network = getNetwork(chainId);
  // console.log("getNFTsFactory", network);

  if (network?.nftsFactory) {
    _providerOrSigner = _providerOrSigner || getProvider(chainId);

    nftsFactory = new ContractEthers(
      network?.nftsFactory || "",
      abis.CloneFactory.concat(abis.NFTsFactory),
      _providerOrSigner
    ) as NFTsFactory;
  }

  return nftsFactory;
}

async function listContractsFromCovalent(
  chainId: number,
  _owner?: string
): Promise<Map<string, Contract>> {
  let contracts: Map<string, Contract> = new Map();
  let path;
  const network = getNetwork(chainId);

  if (network && _owner) {
    const match = `{$or:[{supports_erc:{$elemmatch:"erc721"}},{supports_erc:{$elemmatch:"erc1155"}}]}`;

    path =
      `/${chainId}/address/${_owner}/balances_v2/` +
      `?nft=true` +
      `&no-nft-fetch=false` +
      `&match=${encodeURIComponent(match)}`;

    const answerCov = await fetchCov(path);
    // console.log(path, answerCov);

    if (answerCov.error) {
      console.error("answerCov.error", answerCov.error);
    } else {
      const contractsJson = answerCov?.data?.items || [];
      // console.log(contractsJson[0]);
      // console.log("listContractsFromCovalent nbContracts", contractsJson.length);

      for (let index = 0; index < contractsJson.length; index++) {
        const contract = contractsJson[index];
        const chainName = network.chainName;
        const address = contract.contract_address;

        contracts.set(nftsUrl(chainId, address), {
          chainId,
          chainName,
          address,
          name: contract.contract_name,
          symbol: contract.contract_ticker_symbol,
          totalSupply: contract.balance
        });
      }
    }
  }
  // console.log("listContractsFromCovalent nbContracts ERC721", contracts.length);
  // console.log("listContractsFromCovalent", contracts);

  return contracts;
}

async function listContractsFromTheGraph(
  chainId: number,
  _owner?: string
): Promise<Map<string, Contract>> {
  // console.log("listContractsFromTheGraph");
  let contracts: Map<string, Contract> = new Map();
  const network = getNetwork(chainId);

  if (_owner) {
    const owner = _owner?.toLowerCase();
    const query = `
        {
          ownerPerTokenContracts(
            where: {
              owner: "${owner}"
              }
          ) {
            contract {
              id
              name
              symbol
            }
            numTokens
          }
        }
    `;
    const answerGQL = await fetchGQL(getSubgraphUrl(chainId), query);
    const currentContracts = answerGQL?.ownerPerTokenContracts || [];
    // console.log(currentContracts[0]);

    let index2 = 0;
    for (let index = 0; index < currentContracts.length; index++) {
      const currentContractResponse = currentContracts[index];
      const { contract, numTokens } = currentContractResponse;
      const { id: address, name, symbol } = contract;
      const chainName = network.chainName;
      const totalSupply = Math.max(numTokens, 0);

      if (currentContractResponse.numTokens > 0) {
        contracts.set(nftsUrl(chainId, address), {
          chainId,
          chainName,
          address,
          name,
          symbol,
          totalSupply
        } as Contract);
        index2++;
      }
    }
  }
  // console.log("listcontractsFromTheGraph", contracts);
  return contracts;
}

async function listContractsFromFactory(
  chainId: number,
  _owner: string = ethers.constants.AddressZero,
  _provider?: Provider
): Promise<Map<string, Contract>> {
  // console.log("listContractsFromFactory", chainId, _owner);
  const network = getNetwork(chainId);

  let contracts: Map<string, Contract> = new Map();
  const nftsFactory: NFTsFactory = getNFTsFactory(chainId, _provider);
  // console.log("listContractsFromFactory nftsFactory ok ?", nftsFactory ? "OK" : "KO");

  if (nftsFactory) {
    let balances = [];
    balances = await nftsFactory.balancesOf(_owner);
    // console.log("balances", balances);

    for (let index = 0; index < balances.length; index++) {
      const chainName = network.chainName;
      const balance = balances[index];
      const address = utils.getAddress(balance[0]);
      const name = balance[1];
      const symbol = balance[2];
      const totalSupply = Number(balance[3]);
      const owner = utils.getAddress(balance[4]);
      contracts.set(`nfts://${chainName}/${address}`, {
        totalSupply,
        chainId,
        chainName,
        name,
        symbol,
        address,
        owner
      });
    }
  }

  // console.log("listContractsFromFactory", contracts);
  return contracts;
}

async function listContracts(
  chainId: number,
  _owner?: string,
  _provider?: Provider
): Promise<Array<Contract>> {
  // console.log("listContracts");
  let contracts: Array<Contract> = [];

  const network = getNetwork(chainId);
  if (network) {
    let contractsOwner: Map<string, Contract> = new Map();
    let contractsKredeum: Map<string, Contract> = new Map();

    // GET user contracts
    if (getSubgraphUrl(chainId)) {
      contractsOwner = await listContractsFromTheGraph(chainId, _owner);
    } else if (getCovalent(chainId)) {
      contractsOwner = await listContractsFromCovalent(chainId, _owner);
    }
    contractsKredeum = await listContractsFromFactory(chainId, _owner, _provider);

    // MERGE contractsOwner and contractsKredeum
    const contractsMap = new Map([...contractsOwner, ...contractsKredeum]);
    // console.log("listContracts", contractsMap);
    contracts = [...contractsMap.values()];

    if (typeof localStorage !== "undefined") {
      contracts?.forEach((contract, i) => {
        const address = utils.getAddress(contract.address);
        contracts[i].address = address;
        localStorage.setItem(
          `nfts://${network.chainName}/${address}`,
          JSON.stringify(contract, null, 2)
        );
      });
    }
  }
  // console.log("listContracts", contracts);
  return contracts;
}

function listContractsFromCache(chainId: number) {
  const contracts = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);
    // console.log("listContractsFromCache", key, index);

    if (key?.startsWith("nfts://")) {
      const contract = JSON.parse(localStorage.getItem(key) || "{}");
      // console.log("listContractsFromCache", contract);
      if (chainId && chainId === contract.chainId) {
        contracts.push(contract);
      }
    }
  }
  // console.log("listContractsFromCache", contracts);
  return contracts;
}

async function Clone(chainId: number, _contract: string, _cloner: Signer): Promise<string> {
  const cloner = await _cloner.getAddress();
  // console.log("Clone", chainId, _contract, cloner);

  let ret: string = "";
  const network = getNetwork(chainId);

  const nftsFactory: NFTsFactory = getNFTsFactory(chainId, _cloner);

  if (nftsFactory) {
    const cost = await nftsFactory.cloneCost();
    // console.log(`cost ${ethers.utils.formatEther(cost)}`);

    const tx1 = await nftsFactory.clone("Open NFTs", "NFT", { value: cost });
    console.log(`${network.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    // console.log(res);
    if (res.events) {
      ret = BigNumber.from(res.events[0]?.data).toHexString();
    }
  }

  // console.log(ret);
  return ret;
}

export {
  Clone,
  listContracts,
  listContractsFromCache,
  listContractsFromCovalent,
  listContractsFromTheGraph,
  listContractsFromFactory,
  getNFTsFactory
};
export type { NFTsFactory };
