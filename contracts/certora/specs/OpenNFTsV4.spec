methods {
  getEthBalance     (address)                       returns uint256 envfree

  onERC721Received  (address,address,uint256,bytes) returns(bytes4) envfree => DISPATCHER(true)
}

/**
* No ETH should be stored inside NFT collection...
* but not true for transfer functions => to be solved
*/
rule noETH(method f) filtered {
  f -> f.selector != transferFrom(address,address,uint256).selector
    && f.selector != safeTransferFrom(address,address,uint256).selector
    && f.selector != safeTransferFrom(address,address,uint256,bytes).selector
} {
  require getEthBalance(currentContract) == 0;

  env e; calldataarg args;
  f(e, args);

  assert  getEthBalance(currentContract) == 0;
}