import type { SignerWithAddress } from "hardhat-deploy-ethers/signers";

let nonce = 0;
let noncePrevious = 0;

const getNonce = async (deployer: SignerWithAddress, name = "", label = "", noPrevious = false): Promise<number> => {
  if (deployer) {
    nonce = await deployer.getTransactionCount(); 
    if (!noPrevious) {
      console.log("Nonces", name, label, noncePrevious, nonce);
      if (nonce != noncePrevious + 1) console.warn("Strange nonces...", noncePrevious, nonce);
    }

    noncePrevious = nonce;
  }
  return nonce;
};

export { getNonce };
