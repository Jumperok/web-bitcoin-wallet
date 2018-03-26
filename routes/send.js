const router = require('express').Router();
const db = require('../db');
const client = require('../lib/bitcoin-client');
const promisify = require('../lib/promisify');
const isValidAddress = require('../validation').isValidAddress;

const listUnspent = promisify(client.listUnspent.bind(client));
const createRawTransaction = promisify(client.createRawTransaction.bind(client));
const signRawTransaction = promisify(client.signRawTransaction.bind(client));
const listTransactions = promisify(client.listTransactions.bind(client));

const fromDataToObject = (sendToAddr, amountToSend, fromAddr, tempAmount, fee) => {
  let obj = {};
  obj[sendToAddr] = amountToSend;
  obj[fromAddr] = tempAmount-amountToSend-fee; // send back the rest of money
  return obj;
};

router.get('/send', function(req, res, next) {
  if(db.get('addrFromPrKey') === undefined){
    //window.location.href = "/";
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
  console.log(amountToSend);

  if((amountToSend+fee < db.get('balance')) && (amountToSend > 0)){
    console.log(amountToSend+fee);
    console.log(db.get('balance'));
    if(isValidAddress(sendToAddr)) {
      listUnspent(1, 9999999, [fromAddr])
      .then(listUnsp => {
        let tempAmount = 0;
        let txArray = [];

        for(let i = 0; i < listUnsp.length; i++){ // make txArray
          tempAmount += listUnsp[i].amount;
          txArray.push({"txid":listUnsp[i].txid, "vout":listUnsp[i].vout});
          if(tempAmount > amountToSend + fee){
            console.log("U HAVE ENOUGH MONEY");
            break;
          }
        }

        return createRawTransaction(txArray, fromDataToObject(sendToAddr, amountToSend, fromAddr, tempAmount, fee))
      })
      .then(response => {
        console.log("CREATE_TRANS");
        console.log(response);
        return signRawTransaction(response)
      })
      .then(response => {
        console.log(response);
        res.status(200).send('All ok');
      }).catch(err => {
        console.log('ERROR', err);
      });
    }
    else {
      res.status(400).send("1");
    }
  } else {
    res.status(400).send("2");
  }
}); // router post
//===================================================================================================
router.post('/send/:txid', function(req, res, next) {
  console.log(req.body);
  listTransactions()
  .then(response => {
    //console.log(response);
    for(var i = 0; i<response.length; i++){
      if(response[i].txid == req.body.txid){
        //console.log(response[i].confirmations);
        db.set('confirmations', response[i].confirmations);
        res.status(200).send(response[i].confirmations.toString());
        break;
      }
    }
  })
  .catch(err => {
    console.error(err);
    res.status(400).send("Can't see confirmations");
  });
});

module.exports = router;
