import { task } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

task("nfts-drop", "drop all NFTs owned on a contract")
  .addPositionalParam("contract", "Address of NFT contract")
  .addPositionalParam("owner", "Filter list with owner")
  .setAction(async (_taskArgs: { contract: string; owner: string }, hre) => {
    const { random } = await hre.getNamedAccounts();
    const ethers = hre.ethers;

    const abi = [
      "function balanceOf(address) view returns (uint256)",
      "function tokenOfOwnerByIndex(address,uint256) view returns (uint256)",
      "function safeTransferFrom(address,address,uint256)",
      "function tokenURI(uint256) view returns (string)"
    ];

    const nftContract = await ethers.getContractAt(abi, _taskArgs.contract);
    const n = Number(await nftContract.balanceOf(_taskArgs.owner));

    console.log(`transfer from ${_taskArgs.owner} to ${random}`);

    for (let i = 0; i < n; i += 1) {
      const tokenId = await nftContract.tokenOfOwnerByIndex(_taskArgs.owner, i);
      console.log("tokenId", tokenId.toString(), await nftContract.tokenURI(tokenId));

      const txSend = await nftContract.safeTransferFrom(_taskArgs.owner, random, tokenId, {
        gasLimit: ethers.utils.parseUnits("200", "kwei"),
        gasPrice: ethers.utils.parseUnits("20", "gwei")
      });
      console.log(
        // "https://polygonscan.com/tx/" +
        txSend.hash,
        txSend.nonce,
        txSend.gasPrice.toString(),
        txSend.gasLimit.toString()
      );
      const txReceipt = await txSend.wait();
      console.log(txReceipt.status);
    }
  });
