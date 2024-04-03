type ScaleFaucets = {
  [key: number]: { proofOfWork: `0x${string}`; threshold: number; explorer: string; };
};

// Europa - OK - contract not verified
// Europa Testnet - not filled at 0.2 - contract not verified
// Calypso - OK - contract not verified
// Calypso Testnet - not filled at 0.2 - contract not verified
// Nebula - OK
// Nebula Testnet - not filled at 0.3 - contract not verified
// Titan - OK
// Titan Testnet - not filled at 0.19 - contract not verified
export const scaleFaucets: ScaleFaucets = {
  2046399126: {
    proofOfWork: "0x2B267A3e49b351DEdac892400a530ABb2f899d23",
    threshold: 0.1,
    explorer: "https://elated-tan-skat.explorer.mainnet.skalenodes.com"
  },
  1444673419: {
    proofOfWork: "0x366727B410fE55774C8b0B5b5A6E2d74199a088A",
    threshold: 0.5,
    explorer: "https://juicy-low-small-testnet.explorer.testnet.skalenodes.com"
  },
  1564830818: {
    proofOfWork: "0x02891b34B7911A9C68e82C193cd7A6fBf0c3b30A",
    threshold: 0.005,
    explorer: "https://honorable-steel-rasalhague.explorer.mainnet.skalenodes.com"
  },
  974399131: {
    proofOfWork: "0x62Fe932FF26e0087Ae383f6080bd2Ed481bA5A8A",
    threshold: 0.5,
    explorer: "https://giant-half-dual-testnet.explorer.testnet.skalenodes.com"
  },
  1482601649: {
    proofOfWork: "0x5a6869ef5b81DCb58EBF51b8F893c31f5AFE3Fa8",
    threshold: 0.0001,
    explorer: "https://giant-half-dual-testnet.explorer.testnet.skalenodes.com"
  },
  37084624: {
    proofOfWork: "0x000E9c53C4e2e21F5063f2e232d0AA907318dccb",
    threshold: 0.5,
    explorer: "https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com"
  },
  1350216234: {
    proofOfWork: "0xa5C297dF8f8386E4b940D61EF9A8f2bB367a6fAB",
    threshold: 0.005,
    explorer: "https://parallel-stormy-spica.explorer.mainnet.skalenodes.com"
  },
  1020352220: {
    proofOfWork: "0x08f98Af60eb83C18184231591A8F89577E46A4B9",
    threshold: 0.5,
    explorer: "https://aware-fake-trim-testnet.explorer.testnet.skalenodes.com"
  }
};
