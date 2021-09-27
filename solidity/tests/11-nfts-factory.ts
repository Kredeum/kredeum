import { expect } from "chai";
import { ethers, deployments } from "hardhat";
import type { SignerWithAddress } from "hardhat-deploy-ethers/dist/src/signers";
import type { NFTsFactory } from "../artifacts/types/NFTsFactory";
import type { OpenNFTs } from "../artifacts/types/OpenNFTs";

describe("NFTs Factory contract", function () {
  let nftsFactory: NFTsFactory;
  let openNFTs: OpenNFTs;
  let owner: string;
  let signer: SignerWithAddress;

  before(async () => {
    const txOptions = {
      maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
      maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
      type: 2
    };
    const signer = await ethers.getNamedSigner("deployer");
    owner = signer.address;

    if ((await ethers.provider.getNetwork()).chainId === 31337) {
      await deployments.fixture(["OpenNFTs", "NFTsFactory"]);
    }
    openNFTs = await ethers.getContract("OpenNFTs", signer);
    expect(openNFTs.address).to.be.properAddress;

    nftsFactory = await ethers.getContract("NFTsFactory", signer);
    expect(nftsFactory.address).to.be.properAddress;

    await (await nftsFactory.connect(signer).clone(txOptions)).wait();
    await (await nftsFactory.connect(signer).clone(txOptions)).wait();
    await (await nftsFactory.connect(signer).clone(txOptions)).wait();
    await (await openNFTs.mintNFT(owner, "", txOptions)).wait();
  });

  it("Should get sighash", async function () {
    expect(nftsFactory.interface.getSighash("balanceOf")).to.be.equal("0xf7888aec");
    expect(nftsFactory.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
  });

  it("Should get nftsFactory balanceOf", async function () {
    const bal = await nftsFactory.balanceOf(openNFTs.address, owner);
    console.log(`nftsFactory.balanceOf ${owner} ${bal}`);
    expect(bal.balance).to.be.gte(1);
  });

  it("Should get nftsFactory balancesOf", async function () {
    console.log(await nftsFactory.populateTransaction.balancesOf(owner));
    console.log(`nftsFactory.balancesOf ${owner} ${await nftsFactory.balancesOf(owner)}`);
    expect(await nftsFactory.balancesOf(owner)).to.be.string;
  });

  it("Should get nftsFactory abis", async function () {
    // console.log(nftsFactory.interface.format("minimal"));
    expect(nftsFactory.interface.format("minimal").length).to.be.gt(1);
  });
});
