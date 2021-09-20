import { ethers, BigNumber, utils, Signer, Contract as ContractEthers } from "ethers";
import { fetchCov, fetchGQL } from "./kfetch";
import { abis, contracts, getNetwork, getProvider, getSubgraphUrl, getCovalent } from "./kconfig";
import type { Network, Contract } from "./kconfig";
import type { NFTsFactory } from "../solidity/artifacts/types/NFTsFactory";

function _nfts(_network: string, _address: string): string {
  return "nfts://" + (_network ? _network + (_address ? "/" + _address : "...") : "...");
}

function getNFTsFactory(_network: Network, _signer?: Signer): NFTsFactory {
  return new ContractEthers(
    _network.nftsFactory || "",
    abis.CloneFactory.concat(abis.NFTsFactory),
    _signer || getProvider(_network)
  ) as NFTsFactory;
}

async function listContractsFromCovalent(
  _network: Network,
  _owner?: string
): Promise<Map<string, Contract>> {
  let contracts: Map<string, Contract> = new Map();
  let path;

  if (_network.chainId && _owner) {
    const chainId = parseInt(_network.chainId);
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
        const network = _network.chainName;
        const address = contract.contract_address;

        contracts.set(_nfts(network, address), {
          network,
          address,
          name: contract.contract_name,
          symbol: contract.contract_ticker_symbol,
          totalSupply: contract.balance
        });
      }
    }
  }
  // console.log("listContractsFromCovalent nbContracts ERC721", contracts.length);
  console.log("listContractsFromCovalent", contracts);

  return contracts;
}

async function listContractsFromTheGraph(
  _network: Network,
  _owner?: string
): Promise<Map<string, Contract>> {
  // console.log("listContractsFromTheGraph");
  let contracts: Map<string, Contract> = new Map();

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
    const answerGQL = await fetchGQL(getSubgraphUrl(_network), query);
    const currentContracts = answerGQL?.ownerPerTokenContracts || [];
    // console.log(currentContracts[0]);

    let index2 = 0;
    for (let index = 0; index < currentContracts.length; index++) {
      const currentContractResponse = currentContracts[index];
      const { contract, numTokens } = currentContractResponse;
      const { id: address, name, symbol } = contract;
      const network = _network.chainName;
      const totalSupply = Math.max(numTokens, 0);

      if (currentContractResponse.numTokens > 0) {
        contracts.set(_nfts(network, address), {
          network,
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
  _network: Network,
  _owner: string = ethers.constants.AddressZero
): Promise<Map<string, Contract>> {
  // console.log("listContractsFromFactory", _network, _owner);

  let contracts: Map<string, Contract> = new Map();
  const factory: NFTsFactory = getNFTsFactory(_network);

  if (factory) {
    let balances;
    balances = await factory.balancesOf(_owner);
    // console.log("balances", balances);

    for (let index = 0; index < balances.length; index++) {
      const network = _network.chainName;
      const balance = balances[index];
      const address = utils.getAddress(balance[0]);
      const name = balance[1];
      const symbol = balance[2];
      const totalSupply = Number(balance[3]);
      contracts.set(`nfts://${network}/${address}`, {
        totalSupply,
        network,
        name,
        symbol,
        address
      });
    }
  }

  // console.log("listContractsFromFactory", contracts);
  return contracts;
}

function listContractsFromConfig(_network: Network): Map<string, Contract> {
  // console.log("listContractsFromConfig");
  const network = _network?.chainName;

  const _contracts = contracts.filter((_contract: Contract) => _contract.network === network);
  const contractsMap = new Map(_contracts.map((item) => [_nfts(network, item.address), item]));

  // console.log("listContractsFromConfig", contractsMap);
  return contractsMap;
}

async function listContracts(_chainId: string, _owner?: string): Promise<Array<Contract>> {
  // console.log("listContracts");
  let contracts: Array<Contract> = [];

  const network = getNetwork(_chainId);
  if (network) {
    let contractsOwner: Map<string, Contract> = new Map();
    let contractsKredeum: Map<string, Contract> = new Map();

    // GET user contracts
    if (getSubgraphUrl(network)) {
      contractsOwner = await listContractsFromTheGraph(network, _owner);
    } else if (getCovalent(network)) {
      contractsOwner = await listContractsFromCovalent(network, _owner);
    }

    contractsKredeum = await listContractsFromFactory(network, _owner);
    if (contractsKredeum.size === 0) {
      // GET Kredeum contracts from Config
      contractsKredeum = listContractsFromConfig(network);
    }

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

function listContractsFromCache(_chainId: string) {
  // console.log("listContractsFromCache");
  const contracts = [];

  for (let index = 0; index < localStorage.length; index++) {
    const key = localStorage.key(index);

    if (key?.startsWith("nfts://")) {
      const contract = JSON.parse(localStorage.getItem(key) || "{}");
      if (_chainId && _chainId === contract.chainId) {
        contracts.push(contract);
      }
    }
  }
  return contracts;
}

async function Clone(_chainId: string, _contract: string, _cloner: Signer): Promise<string> {
  const cloner = await _cloner.getAddress();
  console.log("Clone", _chainId, _contract, cloner);

  let ret: string = "";
  const network = getNetwork(_chainId);

  const nftsFactory: NFTsFactory = getNFTsFactory(network, _cloner);

  if (nftsFactory) {
    const tx1 = await nftsFactory.clone();
    console.log(`${network.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    console.log(res);
    if (res.events) {
      ret = BigNumber.from(res.events[0]?.data).toHexString();
    }
  }

  console.log(ret);
  return ret;
}

export {
  Clone,
  listContracts,
  listContractsFromCache,
  listContractsFromCovalent,
  listContractsFromTheGraph,
  listContractsFromFactory,
  listContractsFromConfig,
  getNFTsFactory
};
export type { NFTsFactory };
