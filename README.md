# Web Bitcoin Wallet

Bitcoin wallet that can create and send transactions to the bitcoin network.

## Getting Started

1) In order to run this application you need a running bitcoin node. https://bitcoin.org/en/full-node#what-is-a-full-node here you can see how to install bitcoin node.
2) You need to create "bitcoin.conf" file inside directory whose path depends on the OS. https://bitcoin.org/en/full-node#configuration-tuning here you can see the path of this directory. Put the following text inside "bitcoin.conf" and save:
```
# Run on the test network instead of the real bitcoin network.
testnet=1

# Listening mode, enabled by default except when 'connect' is being used
listen=1

# To be able to get transactions data for any transaction in the blockchain.
txindex=1

rpcuser=test
rpcpassword=test123

# Listen for RPC connections on this TCP port:
rpcport=18332

# running on another host using this option:
rpcconnect=127.0.0.1
```
3) After installation run bitcoin node as daemon, here you can see how to do it https://bitcoin.org/en/full-node#ubuntu-daemon.
4) Download this application and install all dependencies that it needs by means of command:
```
npm i
```
5) Run this application by dint of command:
```
npm start
```
6) Open new tab in a browser and type:
```
http://localhost:3000
```
7) Application has to be started.

## How to use this wallet

1) First of all pass your raw private key (not WIF) and click "Open". It might take a while before your private key will be imported to the wallet. So please wait a couple of minutes.
2) Then just put an address that will take your money and amount of money. Click "Send" and wait untill your transaction will be confirmed.
