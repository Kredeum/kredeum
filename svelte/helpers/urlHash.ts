let urlChainId: number;
let urlCollection: string;
let urlTokenID: number;

const urlHash = window.location.hash;


// URL  https://beta.kredeum.com/#/1/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769
// HASH #/1/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769

const res = urlHash.match(/^#\/([a-z]+)(\/(0x[0-9abcdefABCDEF]{40})(\/([0-9]+))?)?$/);
console.log("urlHash res", res);

if (res) {
  urlChainId = Number(res[1]);
  urlCollection = res[3] || "";
  urlTokenID = Number(res[6]) || -1;

  console.log("urlHash", urlChainId, urlCollection, urlTokenID);
}

export { urlChainId, urlCollection, urlTokenID };
