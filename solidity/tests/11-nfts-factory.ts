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
  const artist = "0xF49c1956Ec672CDa9d52355B7EF6dEF25F214755";

  before(async () => {
    const txOptions = {
      maxFeePerGas: ethers.utils.parseUnits("50", "gwei"),
      maxPriorityFeePerGas: ethers.utils.parseUnits("50", "gwei"),
      type: 2
    };

    const chainId = (await ethers.provider.getNetwork()).chainId;
    const signer = await ethers.getNamedSigner("deployer");
    owner = signer.address;

    if (chainId === 31337) {
      await deployments.fixture(["OpenNFTs"]);
    }
    openNFTs = await ethers.getContract("OpenNFTs", signer);
    expect(openNFTs.address).to.be.properAddress;

    if (chainId === 31337) {
      await deployments.fixture(["NFTsFactory"]);
    }
    nftsFactory = await ethers.getContract("NFTsFactory", signer);
    expect(nftsFactory.address).to.be.properAddress;

    await (await nftsFactory.addTemplate(openNFTs.address, txOptions)).wait();
    await (await nftsFactory.addTemplate(openNFTs.address, txOptions)).wait();
    await (await openNFTs.mintNFT(artist, "", txOptions)).wait();
  });

  it("Should get sighash", async function () {
    console.log("owner", nftsFactory.interface.getSighash("owner"));
    expect(nftsFactory.interface.getSighash("balanceOf")).to.be.equal("0xf7888aec");
    expect(nftsFactory.interface.getSighash("balancesOf")).to.be.equal("0x6392a51f");
  });

  it("Should get nftsFactory balanceOf", async function () {
    console.log(
      `nftsFactory.balanceOf ${artist} ${await nftsFactory.balanceOf(openNFTs.address, artist)}`
    );
    const bal = await nftsFactory.balanceOf(openNFTs.address, artist);
    expect(bal.balance).to.be.gte(1);
  });

  it("Should get nftsFactory balancesOf", async function () {
    console.log(await nftsFactory.populateTransaction.balancesOf(artist));
    console.log(`nftsFactory.balancesOf ${artist} ${await nftsFactory.balancesOf(artist)}`);
    expect(await nftsFactory.balancesOf(artist)).to.be.string;
  });

  it("Should get nftsFactory abis", async function () {
    // console.log(nftsFactory.interface.format("minimal"));
    expect(nftsFactory.interface.format("minimal").length).to.be.gt(1);
  });
});
