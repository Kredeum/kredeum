const urlRef = () => {
  let urlChainName: string;
  let urlCollection: string;
  let urlTokenID: number;

  const urlHash = window.location.hash;
  console.log("urlRef ~ urlHash", urlHash);

  // URL = https://beta.kredeum.com/#/mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769
  // HASH = #/mainnet/0x06012c8cf97BEaD5deAe237070F9587f8E7A266d/771769
  // HASH = #/chainName/collectionAddress/tokenID

  if (urlHash) {
    const res = urlHash.match(/^#\/([a-z]+)(\/(0x[0-9abcdefABCDEF]{40})(\/([0-9]+))?)?$/);
    console.log("urlRef ~ res", res);

    if (res) {
      urlChainName = res[1];
      urlCollection = res[3];
      urlTokenID = Number(res[5]);

      console.log("urlRef", urlChainName, urlCollection, urlTokenID);
    }
  }

  return { urlChainName, urlCollection, urlTokenID };
};
const urlChainName = () => urlRef().urlChainName;
const urlCollection = () => urlRef().urlCollection;
const urlTokenID = () => urlRef().urlTokenID;

export default urlRef;
export { urlChainName, urlCollection, urlTokenID };
