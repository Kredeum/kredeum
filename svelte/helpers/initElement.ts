import { metamaskInit, metamaskSwitchChain } from "@helpers/metamask";
import { ref2Breadcrumb } from "@helpers/breadcrumb";
import { providerSetFallback } from "@lib/common/provider-get";

let done = false;

const initElement = async (chainId: number, address: string, tokenID: string, account?: string) => {
  console.log("INIT START", { chainId, address, tokenID, account });

  if (done) return;

  console.log("INIT DOING");
  done = true;

  // GET datas from Metamask (after init and if installed)
  const { installed: metamaskInstalled, chainId: metamaskChainId, signer } = await metamaskInit();

  if (metamaskInstalled) {
    if (metamaskChainId) {
      if (chainId) {
        // chainId -> metamaskChainId
        await metamaskSwitchChain(chainId);
      } else {
        // metamaskChainId -> chainId
        chainId = metamaskChainId;
      }
    }
  }

  // SET provider fallback even if metamask not installed
  await providerSetFallback(chainId);

  // SET account as signer is not already setted from url
  if (signer) account ||= signer;

  // SET chainId to mainnet if not setted
  chainId ||= 1;

  console.log("INIT END", ref2Breadcrumb({ chainId, address, tokenID, account, signer }));
  return { chainId, address, tokenID, account, signer };
};

export { initElement };
