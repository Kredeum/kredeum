import { ipfs, log } from "@graphprotocol/graph-ts";
import { OpenNFTs, Transfer as TransferEvent } from "../generated/OpenNFTs/OpenNFTs";
import { Token, Owner, Contract, Transfer } from "../generated/schema";

export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from.toHexString();
  let to = event.params.to.toHexString();
  let tockenId = event.params.tokenId.toHexString();
  let address = event.address.toHexString();

  let tockenIdaddress = tockenId.concat(":".concat(address));
  log.debug(`Transfer detected. From: {} | To: {} | TokenID: {}`, [from, to, tockenId]);

  let transferId = event.transaction.hash.toHexString().concat(":".concat(event.transactionLogIndex.toHexString()));
  let instance = OpenNFTs.bind(event.address);

  let contract = Contract.load(address) || new Contract(address);
  let previousOwner = Owner.load(from) || new Owner(from);
  let newOwner = Owner.load(to) || new Owner(to);

  // TOKEN
  let token = Token.load(tockenIdaddress);
  if (token == null) {
    token = new Token(tockenIdaddress);
    token.contract = event.address.toHexString();
    let uri = instance.try_tokenURI(event.params.tokenId);
    if (!uri.reverted) {
      token.uri = uri.value;
      let cid = token.uri.substring(token.uri.lastIndexOf("/") + 1);

      token.json = ipfs.cat(cid).toString();
      log.debug(`Token detected  tokenuri: {} | cid: {} | json: {}`, [token.uri, cid, token.json]);
    }
  }
  token.owner = to;

  // TRANSFERT
  let transfer = Transfer.load(transferId);
  if (transfer == null) {
    transfer = new Transfer(transferId);
    transfer.token = tockenId;
    transfer.from = from;
    transfer.to = to;
    transfer.timestamp = event.block.timestamp;
    transfer.block = event.block.number;
    transfer.transactionHash = event.transaction.hash.toHexString();
  }

  let name = instance.try_name();
  if (!name.reverted) {
    contract.name = name.value;
  }

  let symbol = instance.try_symbol();
  if (!symbol.reverted) {
    contract.symbol = symbol.value;
  }

  let totalSupply = instance.try_totalSupply();
  if (!totalSupply.reverted) {
    contract.totalSupply = totalSupply.value;
  }

  previousOwner.save();
  newOwner.save();
  token.save();
  contract.save();
  transfer.save();
}
