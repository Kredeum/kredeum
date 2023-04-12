// mnftc-script.js

jQuery(document).ready(function($) {
    if (typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        console.log('Web3 provider found:', web3.currentProvider);
        const nftContractAddress = nftData.nftContractAddress;
        console.log('NFT contract address:', nftContractAddress);

        async function checkNftOwnership() {
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
                  
                  nftContract.methods.balanceOf(userAddress).call((error, balance) => {
                    if (error) {
                      console.error('Error checking NFT ownership:', error);
                      return;
                    }
                  
                    if (balance > 0) {
                      // The user owns at least one NFT from the collection
                      console.log('User owns at least one NFT from the collection');
                      $('#nft-owner-content').show();
                    } else {
                      // The user doesn't own any NFT from the collection
                      console.log('User does not own any NFT from the collection');
                      $('#nft-error-message').show();
                    }
                  });
            } catch (error) {
                console.error('Error checking NFT ownership:', error);
            }
        }

        checkNftOwnership();
    } else {
        // Display an error message if no Web3 provider is found
        $('#nft-error-message').html('Please install MetaMask or another Web3 provider to view this content.').show();
    }
});
