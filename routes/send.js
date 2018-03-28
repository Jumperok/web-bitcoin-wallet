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

const fromDataToObject = (sendToAddr, amountToSend, fromAddr, tempAmount, fee) => {
  let obj = {};
  obj[sendToAddr] = amountToSend;
  obj[fromAddr] = (tempAmount-amountToSend-fee).toFixed(8); // send back the rest of money
  return obj;
};

router.get('/send', function(req, res, next) {
  if(db.get('addrFromPrKey') === undefined){
    res.render('login');
  } else {
    res.render('send', { address: db.get('addrFromPrKey'), balance: db.get('balance')});
  }
});
//=================================================================================================================================
router.post('/send', function(req, res, next) {
  const fromAddr = db.get('addrFromPrKey').toString();
  const fee = 0.0001;
  const sendToAddr = req.body.toAddr
  const amountToSend = +req.body.amount;

  if((amountToSend+fee < db.get('balance')) && (amountToSend > 0)){ //if you have enough money
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
      .then(response => {
        return signRawTransaction(response)
      })
      .then(response => {
        return sendRawTransaction(response.hex)
      })
      .then(response => {
        res.status(200).send(response);
      })
      .catch(err => {
        console.log('ERROR', err);
      });
    }
    else {
      res.status(400).send("1"); // invalid address
    }
  } else {
    res.status(400).send("2"); // don't have enough money
  }
}); // router post
//===================================================================================================
router.post('/send/:txid', function(req, res, next) {
  console.log(req.body);

  listTransactions()
  .then(response => {

    for(var i = 0; i<response.length; i++){
      if(response[i].txid == req.body.txid){
        db.set('confirmations', response[i].confirmations);
        break;
      }
    }

  })
  .then(() => {
    console.log(db);
    res.status(200).send(db.get('confirmations').toString());
  })
  .catch(err => {
    console.error(err);
    res.status(400).send("Can't see confirmations");
  });
});

module.exports = router;
