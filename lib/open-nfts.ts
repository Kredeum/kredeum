import { ethers, utils, Signer, BigNumber } from "ethers";
import { abis, contracts, getNetwork, getProvider, getSubgraphUrl, getCovalent } from "./kconfig";
import type { Provider } from "@ethersproject/abstract-provider";

import { fetchCov, fetchGQL, fetchJson } from "./kfetch";
import type { Network, Contract } from "./kconfig";
import type { NftMetadata, NftData } from "./ktypes";

const LIMIT = 99;

function _nft(_network: string, _contract: string, _tokenId: string, plus: string = "..."): string {
  return (
    "nft://" +
    (_network
      ? _network + (_contract ? "/" + (_contract + _tokenId ? "/" + _tokenId : plus) : plus)
      : plus)
  );
}

async function getOpenNFTs(
  _network: Network,
  _contract: string,
  _signer?: Signer | Provider
): Promise<any> {
  return (
    _contract &&
    new ethers.Contract(
      _contract,
      abis.ERC721.concat(abis.KredeumV2),
      _signer || getProvider(_network)
    )
  );
}

////////////////////////////////////////////////////////
// TOKEN
////////////////////////////////////////////////////////
// SMARTCONTRACT DATA
// contract  = "0xaaa...aaa"
// tokenID   = "nnn"
// owner     = "0xbbb...bbb"
////////////////////////////////////////////////////////
// METADATA?
// tokenURI    = "https://ipfs.io/iofs/bafaaaaa...aaaa"
// metadata    = {...}
// image       =
// name        = "image name"
// description = "description image"
// minter?     = ""
////////////////////////////////////////////////////////
// NID = NFT ID = "0xaaa...aaa_nnn@chain"
// CID = IPDS ID = "bax..."
// PID = WP IP = "123"
////////////////////////////////////////////////////////

function cidExtract(_uri: string): string {
  let cid: string = "";
  if (_uri) {
    const cid1 = _uri.match(/^ipfs:\/\/(.*)$/i);
    const cid2 = _uri.match(/^.*\/ipfs\/([^\/]*)(.*)$/i);
    cid = (cid1 && cid1[1]) || (cid2 && cid2[1]) || "";
  }
  // console.log('cid' cid, '<=', _image);
  return cid;
}

function addNftDataSync(_chainId: string, _contract: string, _token: NftData): NftData {
  const network = getNetwork(_chainId);

  const contract = _token.contract || _contract || "";
  const chainName = _token.chainName || network?.chainName || "";
  const metadata: NftMetadata = _token.metadata || {};
  const image = _token.image || metadata.image || "";
  const tokenID = _token.tokenID || "";

  const nftData: NftData = {
    tokenID: _token.tokenID || "",
    tokenURI: _token.tokenURI || "",

    contract,
    chainName,

    // metadata,
    image,

    name: _token.name || metadata.name || "",
    description: _token.description || metadata.description || "",

    creator: _token.creator || metadata.creator || "",
    minter: _token.minter || metadata.minter || "",
    owner: _token.owner || metadata.owner || "",

    cid: _token.cid || metadata.cid || cidExtract(_token.tokenURI) || cidExtract(image) || "",
    nid: _token.nid || _nft(chainName, contract, tokenID)
  };
  console.log("addNftDataSync", _token, "=>", nftData);
  return nftData;
}

async function addNftData(_chainId: string, _contract: string, _token: NftData): Promise<NftData> {
  console.log("_token", _token);
  console.log("_token.tokenURI", _token.tokenURI);
  _token.metadata = _token.metadata || ((await fetchJson(_token.tokenURI)) as NftMetadata) || {};
  console.log("_token.metadata", _token.metadata);
  return addNftDataSync(_chainId, _contract, _token);
}

async function getNFTFromContract(
  _smartcontract: any,
  _index: number,
  _owner?: string
): Promise<NftData> {
  let tokenID, tokenURI, owner;

  try {
    if (_owner) {
      tokenID = (await _smartcontract.tokenOfOwnerByIndex(_owner, _index)).toString();
      owner = _owner;
    } else {
      tokenID = (await _smartcontract.tokenByIndex(_index)).toString();
      owner = await _smartcontract.ownerOf(tokenID);
    }
    if (await _smartcontract.supportsMetadata()) {
      tokenURI = await _smartcontract.tokenURI(tokenID);
    }
  } catch (e) {
    console.error("OpenNFTs.getNFTFromContract ERROR", e, tokenID, tokenURI, owner);
  }
  // console.log("getNFTFromContract #" + tokenID, tokenURI, owner);
  return { tokenID, tokenURI, owner };
}

async function listNFTsFromContract(
  _chainId: string,
  _contract: string,
  _limit: number = LIMIT,
  _owner?: string
): Promise<Array<NftData>> {
  console.log("listNFTsFromContract", _chainId, _contract, _limit, _owner);

  let nfts = [];
  const network = getNetwork(_chainId);

  if (network && _contract) {
    try {
      const smartcontract = await getOpenNFTs(network, _contract);
      const nbTokens = _owner
        ? (await smartcontract?.balanceOf(_owner)).toNumber()
        : (await smartcontract?.totalSupply()).toNumber();
      // console.log("listNFTsFromContract totalSupply", nbTokens);

      for (let index = 0; index < Math.min(nbTokens, _limit); index++) {
        nfts[index] = await getNFTFromContract(smartcontract, index, _owner);
        // console.log("listNFTsFromContract item", index + 1, nfts[index]);
      }
    } catch (e) {
      console.error("OpenNFTs.listNFTsFromContract ERROR", e);
    }
  }

  // console.log("listNFTsFromContract", nfts.length);
  // console.log("listNFTsFromContract", nfts);
  return nfts;
}

async function listNFTsFromCovalent(
  _chainId: string,
  _contract: string,
  _limit: number = LIMIT,
  _owner?: string
): Promise<Array<NftData>> {
  console.log(
    "OpenNFTs.listNFTlistNFTsFromCovalentsFromTheGraph",
    _chainId,
    _contract,
    _limit,
    _owner
  );

  let nfts: Array<NftData> = [];
  const network = getNetwork(_chainId);

  if (network && _contract && _owner) {
    const match = `{contract_address:"${utils.getAddress(_contract)}"}`;
    const path =
      `/${_chainId}/address/${_owner}/balances_v2/` +
      `?nft=true&no-nft-fetch=false` +
      // `&limit=${_limit}` + // not working with match...
      `&match=${encodeURIComponent(match)}`;

    console.log("listNFTsFromCovalent", path);
    const answerCov = await fetchCov(path);
    console.log("listNFTsFromCovalent", answerCov);

    if (answerCov.error) {
      console.error("answerCov.error", answerCov.error);
    } else {
      const nftsJson = answerCov?.data?.items[0]?.nft_data || [];
      // console.log(answerCov?.data?.items[0]);
      // console.log(nftsJson[0]);
      // console.log(nftsJson);
      // console.log("listNFTsFromCovalent nbTokens", nftsJson.length);

      for (let index = 0, n = 0; index < Math.min(nftsJson.length, _limit); index++) {
        const _token = nftsJson[index];

        if (n < _limit) {
          nfts.push({
            tokenID: _token.token_id,
            tokenURI: _token.token_url,
            owner: _token.owner || _owner || "",
            metadata: _token.external_data,
            minter: _token.original_owner || ""
          });
        }
      }
    }
  }
  // console.log("listNFTsFromCovalent", nfts.length);
  // console.log("listNFTsFromCovalent", nfts);

  return nfts;
}

async function listNFTsFromTheGraph(
  _chainId: string,
  _contract: string,
  _limit: number = LIMIT,
  _owner?: string
): Promise<Array<NftData>> {
  console.log("listNFTsFromTheGraph", _chainId, _contract, _limit, _owner);

  let nfts: Array<NftData> = [];
  const network = getNetwork(_chainId);

  if (network && _contract) {
    const contractAddress = _contract.toLowerCase();
    const whereOwner = _owner ? `where: { owner: "${_owner.toLowerCase()}" }` : "";

    const query = `{
      tokenContract( id: "${contractAddress}" ) {
        nfts( first:${_limit} ${whereOwner} ) {
          id
          owner{
            id
          }
          tokenID
          tokenURI
        }
      }
    }`;
    // metadata
    // name
    // description
    // image

    // console.log(query);
    const answerGQL = await fetchGQL(getSubgraphUrl(network) || "", query);
    const nftsJson = answerGQL?.tokenContract?.nfts || [];
    // console.log(nftsJson[0]);
    // console.log("listNFTsFromTheGraph nbTokens", nftsJson.length);
    // console.log(nftsJson);

    for (let index = 0; index < Math.min(nftsJson.length, _limit); index++) {
      const _token = nftsJson[index];

      nfts.push({
        tokenID: _token.tokenID,
        tokenURI: _token.tokenURI,
        owner: _token.owner?.id || ""
        // metadata: _token.metadata && JSON.parse(_token.metadata),
        // name: _token.name,
        // description: _token.description,
        // image: _token.image
      });
    }
  }
  // console.log("listNFTsFromTheGraph", nfts.length);
  // console.log("listNFTsFromTheGraph", nfts);
  return nfts;
}

async function listNFTs(
  _chainId: string,
  _contract: string,
  _limit: number = LIMIT,
  _owner?: string
): Promise<Array<NftData>> {
  console.log("listNFTs", _chainId, _contract, _limit, _owner);

  let nfts: Array<NftData> = [];
  const network = getNetwork(_chainId);

  if (network) {
    nfts = (await listNFTsFromContract(_chainId, _contract, _limit, _owner)) as Array<NftData>;
    if (nfts.length === 0) {
      if (getSubgraphUrl(network)) {
        nfts = (await listNFTsFromTheGraph(_chainId, _contract, _limit, _owner)) as Array<NftData>;
      } else if (getCovalent(network)) {
        nfts = (await listNFTsFromCovalent(_chainId, _contract, _limit, _owner)) as Array<NftData>;
      } else {
        console.error("No NFTs found:-(");
      }
    }

    if (nfts.length) {
      nfts.sort((a, b) => (BigNumber.from(b.tokenID).gt(BigNumber.from(a.tokenID)) ? 1 : -1));
      for (let index = 0; index < Math.min(nfts.length, _limit); index++) {
        const token: NftData = await addNftData(_chainId, _contract, nfts[index]);
        if (!_owner || utils.getAddress(token.owner) === utils.getAddress(_owner)) {
          nfts[index] = token;
        }

        if (typeof localStorage !== "undefined") {
          const tokenJson = JSON.stringify(token, null, 2);
          localStorage.setItem(`nft://${token.nid}`, tokenJson);
        }
      }
    }
  }
  // console.log("listNFTs", nfts.length);
  console.log(`OpenNFTs.listNFTs from ${_contract}`, nfts);
  return nfts;
}

function listNFTsFromCache(
  _chainId: string,
  _contract?: string,
  _limit: number = LIMIT
): Array<NftData> {
  console.log("listNFTsFromCache", _chainId, _contract, _limit);

  const nfts: Array<NftData> = [];
  const { chainName } = getNetwork(_chainId);

  if (chainName) {
    for (let index = 0; index < Math.min(localStorage.length, _limit); index++) {
      const key = localStorage.key(index);
      if (key?.startsWith(_nft(chainName, _contract || "", "", ""))) {
        const json = localStorage.getItem(key);
        json && nfts.push(JSON.parse(json));
      }
    }
    nfts.sort((a, b) => (BigNumber.from(b.tokenID) > BigNumber.from(a.tokenID) ? 1 : 0));
  }

  console.log(`OpenNFTs.listNFTsFromCache ${nfts.length}`);
  return nfts;
}

async function Mint(
  _chainId: string,
  _contract: string,
  _minter: Signer,
  _urlJson: string
): Promise<NftData | undefined> {
  const minter = await _minter.getAddress();
  console.log("OpenNFTs.Mint", _chainId, _contract, minter, _urlJson);

  let token: NftData | undefined;
  const network = getNetwork(_chainId);
  const smartcontract = await getOpenNFTs(network, _contract, _minter);

  if (smartcontract) {
    // const txOptions = {
    //   maxPriorityFeePerGas: utils.parseUnits("50", "gwei"),
    //   maxFeePerGas: utils.parseUnits("50", "gwei"),
    //   type: 2
    // };

    const tx1 = await smartcontract.mintNFT(minter, _urlJson);
    console.log(`${network.blockExplorerUrls[0]}/tx/` + tx1.hash);

    const res = await tx1.wait();
    //console.log(res.events);

    if (res.events) {
      token = await addNftData(_chainId, minter, {
        tokenID: res.events[0]?.args[2]?.toString(),
        tokenURI: _urlJson,
        creator: minter,
        minter: minter,
        owner: minter
      });
    }
  }

  return token;
}

export {
  Mint,
  listNFTs,
  listNFTsFromCache,
  listNFTsFromContract,
  listNFTsFromCovalent,
  listNFTsFromTheGraph,
  addNftData,
  getOpenNFTs
};
