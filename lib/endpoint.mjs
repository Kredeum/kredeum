const endpoint = function (chainId = 1) {
  let network, url;

  const INFURA_API_KEY = '013641c7bbd54950b64584b51a782d0e';
  const MATICVIGIL_API_KEY = '9be3c456ae90b3eea0c4743c483c0dfc9696f2ae';


  switch (Number(chainId)) {
    case 3:
      url = `https://ropsten.infura.io/v3/${INFURA_API_KEY}`;
      network = 'ropsten';
      break;
    case 4:
      url = `https://rinkeby.infura.io/v3/${INFURA_API_KEY}`;
      network = 'rinkeby';
      break;
    case 5:
      url = `https://gorli.infura.io/v3/${INFURA_API_KEY}`;
      network = 'gorli';
      break;
    case 42:
      url = `https://kovan.infura.io/v3/${INFURA_API_KEY}`;
      network = 'kovan';
      break;
    case 56:
      network = 'bsc';
      url = `https://bsc-dataseed.binance.org/`;
      break;
    case 100:
      network = 'xdai';
      url = `https://xdai.poanetwork.dev`;
      break;
    case 137:
      network = 'matic'; // ex matic
      url = `https://rpc-mainnet.maticvigil.com/v1/${MATICVIGIL_API_KEY}`;
      break;
    case 8001:
      network = 'mumbai';
      url = `https://rpc-mumbai.maticvigil.com/v1/${MATICVIGIL_API_KEY}`;
      break;


    default:
    case 1:
      url = `https://mainnet.infura.io/v3/${INFURA_API_KEY}`;
      network = 'mainnet';
      break;
  };
  console.log(chainId, '=>', network, url);
  return { network, url };
}

export default endpoint;
