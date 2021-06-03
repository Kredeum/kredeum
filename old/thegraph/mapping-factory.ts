import { log } from "@graphprotocol/graph-ts";
import { OpenNFTs } from "../generated/templates";
import { NewOpenNFTs as NewOpenNFTsEvent } from "../generated/OpenNFTsFactory/OpenNFTsFactory";

export function handleNewOpenNFTs(event: NewOpenNFTsEvent): void {
  let clone = event.params.clone.toHexString();
  let creator = event.params.creator.toHexString();
  let address = event.address.toHexString();
  log.debug(`NewOpenNFTs detected. Clone: {} | Creator: {} | Address: {}`, [clone, creator, address]);
  OpenNFTs.create(event.params.clone);
}
