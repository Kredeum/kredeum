function listContractsFromConfig(_network: Network): Map<string, Contract> {
  // console.log("listContractsFromConfig");
  const network = _network?.chainName;

  const _contracts = contracts.filter((_contract: Contract) => _contract.network === network);
  const contractsMap = new Map(_contracts.map((item) => [_nfts(network, item.address), item]));

  // console.log("listContractsFromConfig", contractsMap);
  return contractsMap;
}
if (contractsKredeum.size === 0) {
  // GET Kredeum contracts from Config
  contractsKredeum = listContractsFromConfig(network);
}
