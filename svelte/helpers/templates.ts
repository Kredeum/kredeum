const templates = new Map([
  [
    "OpenNFTsV4/ownable",
    {
      name: "OpenNFTs",
      type: "OpenNFTsV4",
      subtype: "ownable",
      description: "OpenNFTs ownable Collection: own your NFT Collection, only you can Mint NFTs",
      icon: "user"
    }
  ],
  [
    "OpenNFTsV4/generic",
    {
      name: "OpenNFTs Generic",
      type: "OpenNFTsV4",
      subtype: "generic",
      description: "OpenNFTs generic Collection: anyone can Mint NFTs in this collection!",
      icon: "building"
    }
  ],
  [
    "OpenAutoMarket/ownable",
    {
      name: "AutoMarket",
      type: "OpenAutoMarket",
      subtype: "ownable",
      description:
        "AutoMarket ownable OpenNFTs Collection: own your collection, mint and sell your NFTs with royalties",
      icon: "dollar-sign"
    }
  ],
  [
    "OpenAutoMarket/generic",
    {
      name: "AutoMarket Generic",
      type: "OpenAutoMarket",
      subtype: "generic",
      description: "AutoMarket generic OpenNFTs Collection: anyone can mint, sell or buy NFTs, with royalties",
      icon: "dollar-sign"
    }
  ]
]);

const templateType = (templateKey: string) => templates.get(templateKey)?.type || "";
const templateSubType = (templateKey: string) => templates.get(templateKey).subtype || "";
const templateMerge = (templateType: string, templateSubType: string) => `${templateType}/${templateSubType}`;
const templateDescription = (templateKey: string) => templates.get(templateKey)?.description || "";

export { templates, templateType, templateSubType, templateMerge, templateDescription };
