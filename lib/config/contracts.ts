import contractsJson from "../../config/contracts.json";

type Contract = {
  name: string;
  address: string;
  network?: string;
  interfaces?: Array<string>;
  symbol?: string;
  totalSupply?: number;
  startBlock?: number;
  description?: string;
};

const contracts = contractsJson as Array<Contract>;

export { contracts, Contract };
