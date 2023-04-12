import type {  Properties } from "@lib/common/types";

import {  DEFAULT_NAME } from "@lib/common/config";


///////////////////////////////////////////////////////////////////////////////////
// GET swarm image uri
const nftSwarmImageUri = async (image: string, key = ""): Promise<string> => {
  return "swarmImageUri";
};

// GET swarm metadata uri
const nftSwarmTokenUri = async (
  name = DEFAULT_NAME,
  nftDescription = "",
  imageUri = "",
  address = "",
  image = "",
  metadata = "{}",
  properties: Properties = {},
  animation_url = ""
): Promise<string> => {
  return "swarmTokenUri";
};

export { nftSwarmImageUri, nftSwarmTokenUri };