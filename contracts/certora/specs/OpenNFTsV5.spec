methods {
  function getEthBalance(address) external                            returns(uint256)  envfree;
  function onERC721Received(address,address,uint256,bytes) external   returns(bytes4)   envfree;
}

/**
* No ETH should be stored inside NFT collection...
* but not true for transfer functions => to be solved
*/
rule noETH(method f)
// filtered {
//   f -> f.selector != sig:transferFrom(address,address,uint256).selector
//     && f.selector != sig:safeTransferFrom(address,address,uint256).selector
//     && f.selector != sig:safeTransferFrom(address,address,uint256,bytes).selector
// }
 {
  require getEthBalance(currentContract) == 0;

  env e; calldataarg args;
  f(e, args);

  assert  getEthBalance(currentContract) == 0;
}