=== Kredeum NFTs, the easiest way to sell your NFTs directly on your WordPress site ===
Contributors: yoannr35, alexr35, alain
Donate link:  https://www.kredeum.com/
Tags: nft, blockchain, ethereum, polygon, ipfs, swarm
Requires at least: 5.0
Tested up to: 6.7.1
Stable tag: {{version.stable}}
Requires PHP: 7.3
License: GPLv3 or later
License URI: https://www.gnu.org/licenses/gpl-3.0.html

Sell your NFTs directly on your WordPress site in an easy and fast way.

== Description ==

The Wordpress Kredeum NTFs plugin allows you to:
* Store all your medias on decentralized Storage (IPFS or Swarm technology), protecting your medias to be lost in case of any hosting server issues.
* Create your own NFT collections (Basic = OpenNFTs, Royalties = AutoMarket)
* Create your own NFTs
* Associate your collections / NFTs to one of these blockchains: mainnet Ethereum, Matic / Polygon, Arbitrum, Optimism, xDAI, BSC / Binance Smart Chain, Fantom or Avalanche networks
* Add a sell NFT shortcode button in your pages / posts
* Sell your NFTs directly on your wordpress site
* Add a View NFT shortcode button in your pages / posts to redirect to OpenSea NFT marketplace [OpenSea](https://opensea.io/)

Please don’t hesitate to contact us if you have any questions by email contact@kredeum.com or by joining us on Discord https://discord.gg/Vz5AyU2Nfx

== Useful links / docs ==

* [Read Kredeum NFTs documentation, installation and user guide](https://docs.kredeum.com/)
* [Watch Baic Kredeum NFTs presentation on Youtube](https://www.youtube.com/watch?v=gRhz99FiEUs)
* [Watch AutoMarket Kredeum NFTs presentation on Youtube](https://www.youtube.com/watch?v=2c5XAWlqfkI)

== Pre-requirements ==

1. Need to install Metamask extension on your chrome browser + create Metamask account: https://metamask.io/download.html
2. Buy native cryptocurrency Ethereum, Matic, Arbitrum, Optimism, Gnosis Chain, BSC (Binance Smart Chain), Fantom or Avalanche and transfer your new tokens to your Metamask account. Careful native cryptocurrencies are different from Ethereum tokens. You can use bridges to buy native cryptocurrencies like [Polygon bridge](https://wallet.polygon.technology) or [direct onramp solutions](https://global.transak.com/)

== How can you create your own collections? ==

1. In the back-office, go to NFTs > “My NFTs” page
2. Click on Create button
3. Click on “Create collection”
4. Define the type of collection you wish as described here https://docs.kredeum.com/sell-your-nfts-on-your-sites

== How can you create your own NFTs? ==

Option 1
1. In the back-office, go to NFTs > “My NFTs” page
2. Click on Create button
3. Click on “Mint NFT”

Option 2
1. In list of medias, Click on MINT NFT for each wordpress medias

== How can you sell one of your wordpress media? ==

1. In the back-office, go to NFTs > “My NFTs” page
2. Select a network and a collection
3. Click on a NFT
4. (if AutoMarket Collection) Click on "Sell", define a price and click it on "Modify Listing"
5. Click on "Get Shortcode"
6. (if AutoMarket Collection) Click on "Copy" for "SELL ON YOUR WORDPRESS SITE WITH THIS SHORTCODE"
7. (if Basic collection) Click on "Copy" for "VIEW ON OPENSEA FROM YOUR WORDPRESS SITE WITH THIS SHORTCODE"
8. Paste the shortcode inside your posts or pages
9. Users can now buy your NFTs directly on your wordpress for all your AutoMarket NFTs!

== Are NFTs accessible outside my wordpress back-office site ? ==

You can access them with our [Kredeum DAPP](https://app.kredeum.com/).
You can even add your NFTs in any websites you want by using Kredeum "Buy snippet" as described https://docs.kredeum.com/sell-your-nfts-on-your-sites. The "Buy snippet" is accessible in the wordpress back-office > "NFTs" item menu > “My NFTs” page > NFT > "Get Shortcode" > "SELL ON YOUR WEBSITE WITH THIS BUY SNIPPET" !


== Changelog ==
=1.6.10
* Fix XSS vulnerability

=1.6.9
* Fix IPFS upload (use Pinata instead of NftStorage)
* Update RCP API keys

= 1.6.6 (latest & stable) =
* New features :
* Many new deployments, mainly EVM L2s. Available mainnets:
*   ethereum, arbitrum, optimism, scroll, base, mantle, mode, blast, polygon-zkevm
*   linea, zora, polygon, gnosis, avalanche, fantom, bsc, skale-calypso
*   and many related testnets...
* Many bug fixes and performance improvements

= 1.1.4 =
* Deployment to Polygon zkEvm
* Fix on legacy network

= 1.1.3 =
* New Mint button in WP media list, with lot of available parameters
* New OpenSky NFT shortcode, to integrate your NFT with SELL/BUY button in any WP page
* New OpenSky Collection shortcode, to integrate your NFT collection with SELL/BUY button in any WP page
* With HTML widget also, to integrate in any webpage
* Swarm storage added (as an alternative to IPFS)

= 1.1.0 =
* Various fixes after v1.0

= 1.0.4 =
* Kredeum NFTs Factory version 1 !
* With ability to easily publish your own NFT market directly from your WordPress site

= 0.18.3 =
* few fixes on new v0.18 version

= 0.18.1 =
* New improved UI to view only your NFTs or all NFTs from collection
* New AutoMarket Shortcode for WordPress: publish your own marketplace with one Copy & Paste !

= 0.17.2 =
* Fix one bug : some collections did'nt display

= 0.17.1 =
* Various fixes

= 0.17.0 =
* New version available on all 8 networks :
*   Ethereum Mainnet / Arbitrum / Optimism / Matic - Polygon
*   Avalanche / xDai - Gnosis chain / Fantom / Bsc

= 0.16.9 =
* Complete new version with AutoMarket template! available on Matic only

= 0.13.2 =
* Various small improvments

= 0.13.1 =
* Optimism deployment

= 0.13.0 =
* New Grid mode
* WP plugin now uses latest Dapp version

= 0.12.1 =
* Fix Mint button in WordPress media library, when media not already archived on IPFS

= 0.12.0 =
* New version with better performance, better ERC1155 compatibility

= 0.11.1 =
* Bug fixes and performance improvements

= 0.11.0 =
* Bug fixes and performance improvements
* Full UI components refactoring

= 0.10.4 =
* Fix Minting bug without good NFT_STORAGE API KEY

= 0.10.3 =
* Fix and Reset the option to define your own NFT Storage key (or leave default to use a common key)

= 0.10.2 =
* Better support for ERC1155 NFTs
* Bug fixes and performance improvements

= 0.9.19 =
* Fix Minting bug without good NFT_STORAGE API KEY

= 0.9.17 =
* Fix Minting bug with old OpenNFTs SmartContracts, mainly on Ethereum Mainnet

= 0.9.16 =
* New deployment on xDai, in order to get POAP or GitCoin Kudos collections
* Better links on new NFTs page on Etherscan explorer
* Fix bug : NFT panel closing while loading new NFTs after refresh or first loading

= 0.9.15 =
* Bug fixes and performance improvements

= 0.9.13 =
* Fix bug while creation collection from previous v0.9.11 version

= 0.9.11 =
* Deployment of new version on Ethereum Mainnet
* New Sell Button to generate WP shortcode to insert in FrontEnd Pages

= 0.9.10 =
* New design
* Personalized collections
* Deployed on Polygon / Fantom / Avalanche / BSC

= 0.8.4 =
* Fix some bugs from previous version  0.8.1

= 0.8.1 =
* Deployment on Avalanche / AVAX
* Beta setting allowing activation of beta features (2 in this version : import and personnalized collections)

= 0.8.0 =
* Personalized collections

= 0.7.10 =
* First stable version since 0.7.2
* Including WordPress Metadata (0.7.4), NFTs cache management (0.7.5) and ENS resolution (0.7.7)
* Doesn't include unstable import feature (0.7.3): use v0.8+ to test beta import

= 0.7.8 =
* Ethereum rpc key changed
* Minor improvments

= 0.7.7 =
* Add WordPress Post metadata to NFT metadata on Mint
* Display ENS name when available

= 0.7.6 =
* Bug fixes and performance improvements

= 0.7.5 =
* Display performance improvements, via enabled NFTs cache in your browser via local storage

= 0.7.4 =
* Add display of NFT metadatas as information tooltip

= 0.7.3 =
* Import function from "My NFT Wallet" to "WordPress media library"

= 0.7.2 =
* Easy access to other networks with Metamask: links at the bottom of NFTs page

= 0.7.1 =
* Access all your NFTs on the blockchain you are connected to, in "NFTs" page
* One NFT collection is defined per blockchain to Mint your NFT, but now a new listbox allows you to access your NFTs in other ERC721 collections (if you have some !)
* In addition to existing Matic/Polygon network (and Mumbai/Polygon tesnet), these blockchains are now supported :
- Ethereum mainnet
- Fantom
- Binance Smart Chain (BSC)
- Kovan testnet

= 0.5.2 =
* Fix bug : image links display in posts

= 0.5.1 =
* Loading and Display improved times

= 0.5.0 =
* Settings simplification : only NFT Storage settings needed

= 0.4.9 =
* Bug fixes
* Performance improvements thanks to [Kredeum NFTs subgraph](https://thegraph.com/explorer/subgraph/zapaz/kredeum-nft)

= 0.4.8 =
* Readme updates

= 0.4.7 =
* Initial plugin release
