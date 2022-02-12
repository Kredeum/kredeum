import { BigNumber, Contract as SmartContract } from "ethers";
import { networks, contracts, abis, getProvider } from "../../lib/kconfig";
import { getNFTsFactory, NFTsFactory } from "../../lib/nfts-factory";
import { addNftData } from "../../lib/open-nfts";

import type { Signer } from "ethers";
import type { Provider } from "@ethersproject/abstract-provider";
import type { Network, Contract, NftData } from "../../lib/kconfig";

class OpenNFTs {
  network?: Network;
  contract?: Contract;
  provider?: Provider;
  smartcontract?: SmartContract;
  owner?: string; // optional NFT owner

  supportsMetadata?: boolean;
  supportsEnumerable?: boolean;
  // _version0;
  // _version1;

  // Polygon / Matic
  defaultChainId = "0x89";

  constructor() {}

  // SET owner
  setOwner(_owner: string) {
    this.owner = _owner;
  }

  // SET network
  _setNetwork(_chainId: number = this.defaultChainId): Network | undefined {
    const oldNetwork = this.network;

    // Search new network
    const newNetwork =
      _chainId &&
      networks.find((_network: Network) => Number(_network.chainId) === Number(_chainId));

    // Set new network if found and different from old one
    if (newNetwork && newNetwork !== oldNetwork) {
      this.network = newNetwork;
      this.provider = getProvider(newNetwork);
    }

    console.log(`_setNetwork(${_chainId}) =>`, this.network);
    return this.network;
  }

  _setContract(_address?: string): Contract | undefined {
    let contract: Contract | undefined;

    if (_address) {
      // Search contract with this address on same network
      if (this.network) {
        contract = contracts.find(
          (_contract: Contract) =>
            _contract.address === _address && _contract.network === this.network?.chainName
        );
      }
      // Search first contract with same address on other networks
      else {
        contract = contracts.find((_contract: Contract) => _contract.address === _address);
      }
    } else if (this.network) {
      // Search first contract on current network
      contract = contracts.find(
        (_contract: Contract) => _contract.network === this.network?.chainName
      );
    }

    if (contract) {
      this.contract = contract;
    } else {
      console.error("No contract found");
    }

    console.log(`_setContract(${_address}) =>`, this.contract);
    return this.contract;
  }

  async init(
    _chainId?: string,
    _address?: string
  ): Promise<{ network?: Network; contract?: Contract }> {
    // console.log("init", _chainId, _address);

    // Set network with chainId (or default if network not set)
    this._setNetwork(_chainId) || this._setNetwork();

    // Set contract with address (or default)
    this._setContract(_address);

    if (this.contract?.address && this.provider) {
      try {
        const checkContract = new SmartContract(this.contract?.address, abis.ERC165, this.provider);

        let abi = abis.ERC721;

        const waitMetadata = checkContract.supportsInterface("0x5b5e139f");
        const waitEnumerable = checkContract.supportsInterface("0x780e9d63");
        [this.supportsMetadata, this.supportsEnumerable] = await Promise.all([
          waitMetadata,
          waitEnumerable
        ]);
        if (this.supportsMetadata) abi = abi.concat(abis.ERC721Metadata);
        if (this.supportsEnumerable) abi = abi.concat(abis.ERC721Enumerable);
        abi = abi.concat(abis.KredeumV2);
        this.smartcontract = new SmartContract(this.contract?.address, abi, this.provider);
      } catch (e) {
        console.error("ERROR init", _chainId, _address, e);
      }
    }

    const ret = { network: this.network, contract: this.contract };
    console.log(`init ${_chainId} ${_address}`, ret);

    return ret;
  }
}

export { OpenNFTs };
export type { NftData };
