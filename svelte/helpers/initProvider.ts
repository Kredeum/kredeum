import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";
import { providerSetFallback } from "@lib/common/provider-get";
import { isAddressNotZero } from "@lib/common/config";
import { constants } from "ethers";

let done = false;

const initProvider = async (chainId: number, account = constants.AddressZero) => {
  if (done) return;

  console.log("INIT PROVIDER START", chainId, account);
  done = true;

  // GET datas from Metamask (after init and if installed)
  const { installed: metamaskInstalled, chainId: metamaskChainId, signer } = await metamaskInit();

  // metamask (or other compatible browser extension) installed
  if (metamaskInstalled) {
    if (chainId) {
      // chainId -> metamaskChainId
      await metamaskSwitchChain(chainId);
    } else if (metamaskChainId) {
      // metamaskChainId -> chainId
      chainId = metamaskChainId;
    }

    // SET account as signer if not already setted from url
    if (signer && !isAddressNotZero(account)) account = signer;
  }

  // if chainId not defined : mainnet == 1 -> chainId
  chainId ||= 1;

  // SET provider fallback even if metamask not installed
  await providerSetFallback(chainId);

  console.log("INIT PROVIDER  END ", chainId, account, signer);
  return { chainId, account, signer };
};

export { initProvider };
