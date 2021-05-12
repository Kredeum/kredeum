import { log } from '@graphprotocol/graph-ts';
import { KRE, Transfer as TransferEvent } from '../generated/KRE/KRE';
import { Token, Owner, Contract, Transfer } from '../generated/schema';

export function handleTransfer(event: TransferEvent): void {
  let from = event.params.from.toHexString();
  let to = event.params.to.toHexString();
  let tockenId = event.params.tokenId.toHexString();
  let address = event.address.toHexString();
  log.debug(`Transfer detected. From: {} | To: {} | TokenID: {}`, [
    from,
    to,
    tockenId,
  ]);

  let transferId = event.transaction.hash
    .toHexString()
    .concat(':'.concat(event.transactionLogIndex.toHexString()));
  let instance = KRE.bind(event.address);

  let contract = Contract.load(address) || new Contract(address);
  let previousOwner = Owner.load(from) || new Owner(from);
  let newOwner = Owner.load(to) || new Owner(to);

  // TOKEN
  let token = Token.load(tockenId);
  if (token == null) {
    token = new Token(tockenId);
    token.contract = event.address.toHexString();
    let uri = instance.try_tokenURI(event.params.tokenId);
    if (!uri.reverted) {
      token.uri = uri.value;
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
