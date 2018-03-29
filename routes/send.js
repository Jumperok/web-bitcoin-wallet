const router = require('express').Router();
const db = require('../db');
const client = require('../lib/bitcoin-client');
const promisify = require('../lib/promisify');
const isValidAddress = require('../validation').isValidAddress;

const listUnspent = promisify(client.listUnspent.bind(client));
const createRawTransaction = promisify(client.createRawTransaction.bind(client));
const signRawTransaction = promisify(client.signRawTransaction.bind(client));
const listTransactions = promisify(client.listTransactions.bind(client));
const sendRawTransaction = promisify(client.sendRawTransaction.bind(client));
const getBlockHeader = promisify(client.getBlockHeader.bind(client));


const fromDataToObject = (sendToAddr, amountToSend, fromAddr, tempAmount, fee) => {
  let obj = {};
  obj[sendToAddr] = amountToSend;
  obj[fromAddr] = (tempAmount-amountToSend-fee).toFixed(8); // send back the rest of money
  return obj;
};

router.get('/send', function(req, res, next) {
  if (db.get('addrFromPrKey') === undefined) {
    res.render('login');
  } else {
    res.render('send', { address: db.get('addrFromPrKey'), balance: db.get('balance')});
  }
});
//===================================================================================================
router.post('/send', function(req, res, next) {
  const fromAddr = db.get('addrFromPrKey').toString();
  const fee = 0.0001;
  const sendToAddr = req.body.toAddr
  const amountToSend = +req.body.amount;

  if ((amountToSend+fee < db.get('balance')) && (amountToSend > 0)) { //if you have enough money
    if(isValidAddress(sendToAddr)) {
      listUnspent(1, 9999999, [fromAddr])
      .then(listUnsp => {
        let tempAmount = 0;
        let txArray = [];

        for(let i = 0; i < listUnsp.length; i++){ // make txArray
          tempAmount += listUnsp[i].amount;
          txArray.push({"txid":listUnsp[i].txid, "vout":listUnsp[i].vout});
          if(tempAmount > (amountToSend + fee)){ // you can make transaction with txArray that was made
            break;
          }
        }

        return createRawTransaction(txArray, fromDataToObject(sendToAddr, amountToSend, fromAddr, tempAmount, fee))
      })
      .then(result => {
        return signRawTransaction(result)
      })
      .then(result => {
        return sendRawTransaction(result.hex)
      })
      .then(result => {
        res.status(200).send(result);
      })
      .catch(err => {
        if(err.code === -5) {
          res.status(400).send("Invalid address");
        }
        else {
          res.status(400).send("Try again later");
        }
      });
    }
    else {
      res.status(400).send("Invalid address");
    }
  } else {
    res.status(400).send("Not enough money");
  }
}); // router post
//===================================================================================================
router.post('/send/:txid', function(req, res, next) {
  let responseObj = {};

  listTransactions()
  .then(result => {

    for (var i = 0; i<result.length; i++){
      if (result[i].txid === req.body.txid) {
        responseObj.confirmations = result[i].confirmations;
        break;
      }
    }

    return result[i].confirmations > 0 ? getBlockHeader(result[i].blockhash) : false;
  })
  .then(result => {
    responseObj.blockHeight = result.height;
  })
  .then(() => {
    res.status(200).send(responseObj);
  })
  .catch(err => {
    res.status(400).send("Can't see confirmations");
  });
});

module.exports = router;
