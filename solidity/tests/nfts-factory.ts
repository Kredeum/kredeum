import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import type { NFTsFactory } from "../artifacts/types/NFTsFactory";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

describe("NFTs Factory", function () {
  let nftsFactory: NFTsFactory;
  let openNFTs: OpenNFTs;
  let owner: string;
  const txOptions = {
    maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
    type: 2
  };

  before(async () => {
    const signer = await ethers.getNamedSigner("tester1");
    owner = signer.address;

    const chainId = (await ethers.provider.getNetwork()).chainId;

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    openNFTs = await ethers.getContract("OpenNFTs", signer);

    if (chainId === 31337) {
      await deployments.fixture(["NFTsFactory"]);
    }
    nftsFactory = await ethers.getContract("NFTsFactory", signer);

    await (await nftsFactory.addTemplate(openNFTs.address, txOptions)).wait();
    await openNFTs.mintNFT(owner, "", txOptions);
  });

  it("Should get sighash", async function () {
    expect(nftsFactory.interface.getSighash("balanceOf")).to.be.equal("0xf7888aec");
    expect(nftsFactory.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
    expect(openNFTs.interface.getSighash("balanceOf")).to.be.equal("0x70a08231");
  });

  it("Should get openNFTs balanceOf", async function () {
    expect(await openNFTs.balanceOf(owner)).to.be.equal(1);
  });

  it("Should get nftsFactory balanceOf", async function () {
    const bal = await nftsFactory.balanceOf(openNFTs.address, owner);
    expect(bal.balance).to.be.equal(1);
    expect(bal.name).to.be.equal("Open NFTs");
    expect(bal.symbol).to.be.equal("NFT");
    console.log(await nftsFactory.balanceOf(openNFTs.address, owner));
  });

  it("Should get nftsFactory balancesOf", async function () {
    console.log(await nftsFactory.populateTransaction.balancesOf(owner));
    console.log(`nftsFactory.balancesOf ${owner} ${await nftsFactory.balancesOf(owner)}`);
  });
});
