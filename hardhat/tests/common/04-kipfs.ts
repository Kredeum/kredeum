/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect } from "chai";
import Ipfs from "lib/kipfs";
import { ipfsGetLink } from "lib/kconfig";
import FormData from "form-data";
import fetch from "node-fetch";
global.fetch = fetch as any;
global.FormData = FormData as any;

const theGraphEndpoint = "https://api.thegraph.com/ipfs";
const imgUrl = "https://www.kredeum.com/favicon.ico";
const imgCID = "Qmdzo9j2hH75iRuGRP61BQEwj7WF1p5EtJxChz7b7W3aBc";

describe("04 IPFS", () => {
  describe("04 TheGraph : Add Json", () => {
    it("Add Image should return given CID", async () => {
      const theGraph = new Ipfs(theGraphEndpoint);
      const cid = await theGraph.addUrl(imgUrl);
      console.log(cid);
      expect(cid).to.be.equal(imgCID);
    });
  });

  describe("Check ipfsGetLink", () => {
    const expectEquiv = (imageUri: string, ipfs: string) => expect(ipfsGetLink(imageUri)).to.be.equal(ipfs);

    it("Should not modify ipfs:// imageUri", async () => {
      expectEquiv(
        "ipfs://QmeTNdovf1dzSadjqVRVJqz7szDTgWNjMB8JjwvVGXC3tZ",
        "ipfs://QmeTNdovf1dzSadjqVRVJqz7szDTgWNjMB8JjwvVGXC3tZ"
      );
      expectEquiv(
        "ipfs://Qmcm8gU84UB46Cv6wGptqwnt1KKR4gYM69dPjGDohWFtZx/image.gif",
        "ipfs://Qmcm8gU84UB46Cv6wGptqwnt1KKR4gYM69dPjGDohWFtZx/image.gif"
      );
      expectEquiv(
        "ipfs://QmYzbTvmPUgabLHukU7uDGnSvgTJt5gMkrNHctEbrLVM6h/8.webm",
        "ipfs://QmYzbTvmPUgabLHukU7uDGnSvgTJt5gMkrNHctEbrLVM6h/8.webm"
      );
    });

    it("Should modify https://ipfs.io/ipfs imageUri to https://ipfs", async () => {
      expectEquiv(
        "https://ipfs.io/ipfs/QmVzwF2MUcrDz4dhbto87DDmEReLe4QRBjGCVjanMnRYb5",
        "ipfs://QmVzwF2MUcrDz4dhbto87DDmEReLe4QRBjGCVjanMnRYb5"
      );
    });

    it("Should modify ipfs://ipfs/ imageUri to ipfs://", async () => {
      expectEquiv(
        "ipfs://ipfs/Qmcm8gU84UB46Cv6wGptqwnt1KKR4gYM69dPjGDohWFtZx/image.gif",
        "ipfs://Qmcm8gU84UB46Cv6wGptqwnt1KKR4gYM69dPjGDohWFtZx/image.gif"
      );
      expectEquiv(
        "https://ipfs.io/ipfs/bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624",
        "ipfs://bafkreieivwe2vhxx72iqbjibxabk5net4ah5lo3khekt6ojyn7cucek624"
      );
    });

    it("Should modify https ipfs imageUri", async () => {
      expectEquiv(
        "https://maticpunks.mypinata.cloud/ipfs/QmZQbssuvTpbxbvsNybgZjzPw3xrZiLALABR7CsguZCXTo/3909.png",
        "ipfs://QmZQbssuvTpbxbvsNybgZjzPw3xrZiLALABR7CsguZCXTo/3909.png"
      );
      expectEquiv(
        "https://gateway.pinata.cloud/ipfs/bafkreihljat7mzksnqd26ief2ftxiay7b4d5xtxqfy6uplptivjnu54qqi",
        "ipfs://bafkreihljat7mzksnqd26ief2ftxiay7b4d5xtxqfy6uplptivjnu54qqi"
      );
      expectEquiv(
        "https://gateway.pinata.cloud/ipfs/QmWgMivz5o25UJ2kFfahQAj3kg5gWF6CxLSiQxxSQGoEMC",
        "ipfs://QmWgMivz5o25UJ2kFfahQAj3kg5gWF6CxLSiQxxSQGoEMC"
      );
      expectEquiv(
        "https://maticpunks.mypinata.cloud/ipfs/QmRrQR9DfoxvP2brupQbQ2dZSD5gBS5bTNx6Hvy5jk2wWs/Cyborg.gif",
        "ipfs://QmRrQR9DfoxvP2brupQbQ2dZSD5gBS5bTNx6Hvy5jk2wWs/Cyborg.gif"
      );
    });

    it("Should modify Qm or ba CID as imageUri", async () => {
      expectEquiv(
        "QmNmeLYzDj5a7WWqtRo7jNmTawtPeG1a2FvdL98jP2Wd6w",
        "ipfs://QmNmeLYzDj5a7WWqtRo7jNmTawtPeG1a2FvdL98jP2Wd6w"
      );
      expectEquiv(
        "bafkreihljat7mzksnqd26ief2ftxiay7b4d5xtxqfy6uplptivjnu54qqi",
        "ipfs://bafkreihljat7mzksnqd26ief2ftxiay7b4d5xtxqfy6uplptivjnu54qqi"
      );
    });

    it("Should not find non ipfs imageUri", async () => {
      expectEquiv("https://imgmatic.loserchick.fi/5-299360-l", "");
      expectEquiv(
        "https://neon-district-season-one.s3.amazonaws.com/images/blissmanipulatorr-uncommon-body-male-thumb.png",
        ""
      );
    });

    it("Should not find empty imageUri", async () => {
      expectEquiv("", "");
    });
  });
});
