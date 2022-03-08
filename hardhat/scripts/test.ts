const salt = "NFTsFactoryV2";
console.log("salt", salt);

const encoded = Buffer.from(salt).toString("hex");
console.log("encoded", encoded);

const decoded = Buffer.from(encoded, "hex").toString();
console.log("decoded", decoded);
