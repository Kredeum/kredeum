import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("nfts-drop", "drop all NFTs owned on a contract")
  .addPositionalParam("contract", "Address of NFT contract")
  .addPositionalParam("owner", "Filter list with owner")
  .setAction(async (_taskArgs: { contract: string; owner: string }, hre) => {
    const { random } = await hre.getNamedAccounts();

    const abi = [
      "function balanceOf(address) view returns (uint256)",
      "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
      "function safeTransferFrom(address,address,uint256)"
      // "function tokenURI(uint256) view returns (string)"
    ];

    const nftContract = await hre.ethers.getContractAt(abi, _taskArgs.contract);
    const n = Number(await nftContract.balanceOf(_taskArgs.owner));

    console.log("transfer", _taskArgs.owner, random);
    for (let i = 0; i < n; i += 1) {
      const tokenId = await nftContract.tokenOfOwnerByIndex(_taskArgs.owner, i);
      console.log("tokenId", tokenId.toString());
      await nftContract.safeTransferFrom(_taskArgs.owner, random, tokenId);
      // console.log(await nftContract.tokenURI(tokenId));
    }
  });
