// mnftc-script.js

jQuery(document).ready(function($) {
    console.log("ready");
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        console.log('Web3 provider found:', web3.currentProvider);
        //const nftContractAddress = nftData.nftContractAddress;
        //console.log('NFT contract address:', nftContractAddress);

        async function checkNftOwnership(element) {
          const nftContractAddress = element.getAttribute('krd-collection-id');
          console.log(nftContractAddress);
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                const userAddress = accounts[0];
                console.log('User address:', userAddress);

                // The code to check NFT ownership using Web3.js

                const contractABI = [
                    {
                      "constant": true,
                      "inputs": [
                        {
                          "name": "owner",
                          "type": "address"
                        }
                      ],
                      "name": "balanceOf",
                      "outputs": [
                        {
                          "name": "",
                          "type": "uint256"
                        }
                      ],
                      "payable": false,
                      "stateMutability": "view",
                      "type": "function"
                    }
                  ];
                  
                  const nftContract = new web3.eth.Contract(contractABI, nftContractAddress);
                  console.log("nftContract: ", nftContract);
                  
                  nftContract.methods.balanceOf(userAddress).call((error, balance) => {
                    if (error) {
                      console.error('Error checking NFT ownership:', error);
                      return;
                    }
                  
                    if (balance > 0) {
                      // The user owns at least one NFT from the collection
                      console.log('User owns at least one NFT from the collection');
                      $('#krd-nft-access-' + nftContractAddress + ' #nft-owner-content').show();
                    } else {
                      // The user doesn't own any NFT from the collection
                      console.log('User does not own any NFT from the collection');
                      $('#krd-nft-access-' + nftContractAddress + ' #nft-error-message').show();
                    }
                  });
            } catch (error) {
                console.error('Error checking NFT ownership:', error);
            }
        }

        async function checkMetaMaskConnection() {
          try {
              // Get the user's accounts
              const accounts = await window.ethereum.request({ method: 'eth_accounts' });

              // Check if any accounts are connected
              if (accounts.length > 0) {
                  console.log('MetaMask is connected. Account:', accounts[0]);
                  document.querySelectorAll('.krd-collection-id').forEach(element => {
                    //const nftContractAddress = element.getAttribute('krd-collection-id');                    
                    //console.log(`Element's krd-collection-id value: ${nftContractAddress}`);
                    //checkNftOwnership(`${nftContractAddress}`);
                    checkNftOwnership(element);                    
                  });
              } else {
                  console.log('MetaMask is installed but not connected.');
                  $('.metamask-notconnected-message').show();
                  await window.ethereum.request({ method: 'eth_requestAccounts' });
              }
          } catch (error) {
              console.error('Error fetching accounts:', error);
          }
       }

       // Call the function to check MetaMask connection
       checkMetaMaskConnection();

    } else {
        // Display an error message if no Web3 provider is found
        console.log('MetaMask is not installed.');
        $('.metamask-notinstalled-message').show();
    }
});
