import { expect } from "chai";
import { Signer, Contract } from "ethers";
import { ethers, deployments } from "hardhat";
import { CID } from "multiformats/cid";
import { OpenMulti } from "types/OpenMulti";

const contractName = "OpenMulti";

const toV1Raw = (cid: string): string => {
  let cidV1Raw = "";
  try {
    cidV1Raw = CID.create(1, 85, CID.parse(cid).toV1().multihash).toString();
  } catch (e) {
    console.error("Bad CID");
  }
  return cidV1Raw;
};

const cids = [
  "QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR",
  "bafkreia756ojs2x7ld7m6jjlz7djojgonh4sgnqotxsiorhux3az6v45ly",
  "bafkreih5z2blslhwdiophk2t6xltmplw63hbrb42wctcqqeb5dd3eubi5e",
  "bafkreidxflrui7pwvbtzwbgxvgvhvytknkybmc6gppwrvej63cqxegwt6m",
  "bafkreihgf42cncbynpfecfoxilymqzcjrn2rfj4vjqcvnp6ncatzgwxdvi"
];
const cidOK: string = "bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624";
const hashOK: string = "0x88ad89aa9ef7fe9100a501b802aeb493e00fd5bb6a39153f39386fc541115ed7";

const cidKO: string = "bafybeibvs5x2qjy7ipndndx3pbpopywivqe742ytmq5pla7e3qjrdmzkga";
const hashKO: string = "0x35976fa8271f43da368efb785ee7e2c8ac09fe6b13643af583e4dc1311b32a30";

describe(contractName, async () => {
  let signer: Signer;
  let signerAddress: string;
  let openMulti: OpenMulti;

  before(async () => {
    signer = (await ethers.getSigners())[0];
    signerAddress = await signer.getAddress();
    console.log("signer", signerAddress, "\n");

    // Deploy contract if not already
    if (!(await ethers.getContractOrNull(contractName))) {
      console.log(`Deploy ${contractName}...`);
      await deployments.fixture([contractName]);
    }

    openMulti = await ethers.getContract(contractName, signer);
    console.log("contract", openMulti.address, "\n");
  });

  describe("OK", async () => {
    it("Should be ok", async () => {
      expect(signerAddress).to.be.properAddress;
      expect(openMulti.address).to.be.properAddress;
    });

    it("Should transform CID to HEXA", async () => {
      const _cidOK = CID.parse(cidOK);
      const _hashOK = "0x" + Buffer.from(_cidOK.multihash.digest).toString("hex");
      expect(_hashOK).to.be.equal(hashOK);

      const _cidKO = CID.parse(cidKO);
      const _hashKO = "0x" + Buffer.from(_cidKO.multihash.digest).toString("hex");
      expect(_hashKO).to.be.equal(hashKO);
    });
  });

  describe("CLAIM", async () => {
    it("Should claim TokenId 1", async () => {
      await expect(openMulti.claim(1)).to.not.be.reverted;
    });
    it("Should not claim TokenId 1 again", async () => {
      await expect(openMulti.claim(1)).to.be.reverted;
    });
    it("Should claim TokenId from CID", async () => {
      await expect(openMulti.claim(hashOK)).to.not.be.reverted;
    });
    it("Should not claim TokenId from CID again", async () => {
      await expect(openMulti.claim(hashOK)).to.be.reverted;
    });
    it("Should claim TokenId from other CID", async () => {
      await expect(openMulti.claim(hashKO)).to.not.be.reverted;
    });
  });

  describe("TOKENURI", async () => {
    it("Should get TokenURI from TokenId CID", async () => {
      const _tokenURI = await openMulti.tokenURI(hashOK);
      console.log(`<== https://ipfs.io/ipfs/${cidOK}`);
      console.log("==>", _tokenURI);
      expect(_tokenURI).to.be.equal(`https://ipfs.io/ipfs/${cidOK}`);
    });

    it("Should get bad TokenURI from other TokenId CID (TO BE FIXED !)", async () => {
      const _tokenURI = await openMulti.tokenURI(hashKO);
      console.log(`<==  ${cidKO}`);
      console.log(`<==  ${toV1Raw(cidKO)}`);
      console.log(`<== https://ipfs.io/ipfs/${toV1Raw(cidKO)}`);
      console.log("==>", _tokenURI);
      expect(_tokenURI).to.be.equal(`https://ipfs.io/ipfs/${toV1Raw(cidKO)}`);
    });
  });

  describe("ALL", async () => {
    it("Should get back CIDs", async () => {
      for await (const cid of cids) {
        const _cid = CID.parse(toV1Raw(cid));
        const _hash = "0x" + Buffer.from(_cid.multihash.digest).toString("hex");
        await (await openMulti.claim(_hash)).wait();
        const _tokenURI = await openMulti.tokenURI(_hash);
        console.log(`<== https://ipfs.io/ipfs/${cid}`);
        console.log("==>", _tokenURI);
        expect(_tokenURI).to.be.equal(`https://ipfs.io/ipfs/${toV1Raw(cid)}`);
      }
    });
  });
});
