import { expect } from "chai";
import { Signer } from "ethers";
import { ethers, deployments } from "hardhat";
import { OpenMulti } from "@soltypes/contracts/dev";
import { CID } from "multiformats/cid";
const contractName = "OpenMulti";

describe(contractName, () => {
  // const cid = "bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624";
  const cid = "bafkreibhp3dzgc4efjxnmoj7uiyx5sxin4vjvzt7gsyc5ercdyrvtxzx54";
  // console.log("cid", cid);

  let signer: Signer;
  let signerAddress: string;
  let openMulti: OpenMulti;

  before(async () => {
    signer = (await ethers.getSigners())[0];
    signerAddress = await signer.getAddress();
    console.log("signer", signerAddress);

    // Deploy contract if not already
    if (!(await ethers.getContractOrNull(contractName))) {
      console.log(`Deploy ${contractName}...`);
      await deployments.fixture([contractName]);
    }

    openMulti = (await ethers.getContract(contractName, signer)) as unknown as OpenMulti;
    console.log("contract", openMulti.address);
  });

  describe("MULTI", () => {
    it("Should get tokenID, after claim CID if not exists, then get tokenURI from tokenID", async () => {
      const _cid = CID.parse(cid);
      const _tokenID = "0x" + Buffer.from(_cid.multihash.digest).toString("hex");
      console.log("==> tokenID ", _tokenID);

      console.log("totalSupply", String(await openMulti.totalSupply()));
      const exists: boolean = await openMulti.exists(_tokenID);
      if (!exists) {
        console.log("tokenID for CID does not exists, claiming it !");
        await (await openMulti.claim(_tokenID)).wait();
        console.log("totalSupply", String(await openMulti.totalSupply()));
      }

      const _tokenURI = await openMulti.tokenURI(_tokenID);
      console.log("==> tokenURI", _tokenURI);
      expect(_tokenURI).to.be.equal(`https://ipfs.io/ipfs/${cid}`);
    });
  });
});
