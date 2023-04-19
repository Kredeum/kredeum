// STATES : S1-S6
const S0_START = 0;
const S1_STORE_IMAGE = 1;
const S2_STORE_METADATA = 2;
const S3_SIGN_TX = 3;
const S4_WAIT_TX = 4;
const S5_MINTED = 5;

const nftMintTexts = [
  "Mint",
  "Wait till Media stored on decentralized storage",
  "Wait till Metadata stored on decentralized storage",
  "Please, sign the transaction",
  "Wait till transaction completed, it may take one minute or more...",
  "Minted"
];

export { S0_START, S1_STORE_IMAGE, S2_STORE_METADATA, S3_SIGN_TX, S4_WAIT_TX, S5_MINTED, nftMintTexts };
