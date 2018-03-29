# Web Bitcoin Wallet

Bitcoin wallet that can create and send transactions to the bitcoin network.

## Getting Started

1) In order to run this application you need a running bitcoin node. https://bitcoin.org/en/full-node#what-is-a-full-node here you can see how to install bitcoin node. 
2) After installation run bitcoin node as daemon, here you can see how to do it https://bitcoin.org/en/full-node#ubuntu-daemon.
3) Download this application and install all dependencies that it needs by means of command:
```
npm i
```
4) Run this application by dint of command:
```
npm start
```
5) Open new tab in a browser and type:
```
http://localhost:3000
```
6) Application has to be started.

## How to use this wallet

1) First of all pass your raw private key (not WIF) and click "Open". It might take a while before your private key will be imported to the wallet. So please wait a couple of minutes.
2) Then just put an address that will take your money and amount of money. Click "Send" and wait untill your transaction will be confirmed.
