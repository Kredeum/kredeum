import * as fs from "fs/promises";
import networks from "../../config/networks.json";

// console.log(networks);

// const networks2 =
const num = networks.findIndex((network) => network.chainId === 31337);
console.log("num", num);
networks[num].nftsFactory = "OK";

console.log(networks);

fs.writeFile("./config/networks2.json", JSON.stringify(networks, null, 2)).catch((err) => console.log(err));
