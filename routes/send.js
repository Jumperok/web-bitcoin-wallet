const router = require('express').Router();
// const bitcore = require("bitcore-lib");
const db = require('../db');
const client = require('../lib/bitcoin-client');
const promisify = require('../lib/promisify');

const listUnspent = promisify(client.listUnspent.bind(client));
const createRawTransaction = promisify(client.createRawTransaction);

const fromDataToObject = (sendToAddr, amountToSend, fromAddr) => {
  var objj = {};
  objj[sendToAddr] = amountToSend;
  objj[fromAddr] = tempAmount-amountToSend-fee; // back
  return objj;
}

router.get('/send', function(req, res, next) {
  res.render('send', { address: db.get('addrFromPrKey'), balance: db.get('balance')});
});
//=================================================================================================================================
router.post('/send', function(req, res, next) {
  const fromAddr = db.get('addrFromPrKey').toString();
  const fee = 0.0001;
  const sendToAddr = req.body.toAddr
  const amountToSend = +req.body.amount;

  // listUnspent(1, 99990, [fromAddr])
  //   .then(res => {
  //
  //   })

  if(/^[2mn][1-9A-HJ-NP-Za-km-z]{26,35}/.test(sendToAddr)) {
    // (new Promise((resolve, reject) => {
    //   client.listUnspent(1, 9999999, [fromAddr], (err, res) => {
    //     err ? reject(err) : resolve(res);
    //   })
    // }))
    // .then(res => {
    //   const listUnspent = res;
    //   var tempAmount = 0;
    //   for(var i=0; i<listUnsp.length; i++){
    //     tempAmount+=listUnsp[i].amount;
    //
    //     if(tempAmount > amountToSend + fee){
    //       console.log("U HAVE ENOUGH MONEY");
    //       //console.log(sendToAddr);
    //       function fromDataToObject(sendToAddr, amountToSend, fromAddr) {
    //         var objj = {};
    //         objj[sendToAddr] = amountToSend;
    //         objj[fromAddr] = tempAmount-amountToSend-fee; // back
    //         return objj;
    //       }
    //       console.log(fromDataToObject(sendToAddr, amountToSend, fromAddr));
    //       return new Promise((resolve, reject) => {
    //         client.createRawTransaction([{"txid":listUnsp[0].txid, "vout":listUnsp[0].vout}], fromDataToObject(sendToAddr, amountToSend, fromAddr), (err, res) => {
    //           err ? reject(err) : resolve(res);
    //         });
    //       });
    // })


    // client.listUnspent(1, 9999999, [fromAddr], function(err, res){
      listUnspent(1, 9999999, [fromAddr]).then(result => {
        console.log(result);
        const listUnsp = result;
        var tempAmount = 0;

        for(var i=0; i<listUnsp.length; i++){
          tempAmount+=listUnsp[i].amount;

          if(tempAmount > amountToSend + fee){
            console.log("U HAVE ENOUGH MONEY");
            //console.log(sendToAddr);

            console.log(fromDataToObject(sendToAddr, amountToSend, fromAddr));
            client.createRawTransaction([{"txid":listUnsp[0].txid, "vout":listUnsp[0].vout}], fromDataToObject(sendToAddr, amountToSend, fromAddr), function(err, response){
              console.log("CREATE_TRANS");
              console.log(response);
              client.signRawTransaction(response, function(err, response) {
                console.log("SIGNED");
                console.log(err);
                console.log(response);
              });
            });
            //res.status(200).send("Ok");
            break;
          }// if
        } // for

      res.status(400).send("Not Enough Money");
    }).catch(err => {
      console.log('ERROR', err);
    })

  }
  else {
    res.status(400).send("bad address!");
  }
});
//===================================================================================================
router.post('/send/:txid', function(req, res, next) {
  console.log(req.body);
  client.listTransactions(function(err, response) {
    console.log(err);
    console.log(response);
    for(var i =0; i<response.length; i++){
      if(response[i].txid == req.body.txid){
        console.log(response[i].confirmations);
        db.set('confirmations', response[i].confirmations);
        res.status(200).send(response[i].confirmations.toString());
        break;
      }
    }
  });
});

module.exports = router;
