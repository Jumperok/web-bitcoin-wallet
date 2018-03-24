const router = require('express').Router();
const bitcore = require("bitcore-lib");

const client = require('../lib/bitcoin-client');

router.get('/send', function(req, res, next) {
  res.render('send', { address: addrFromPrKey, balance: bal });
});
//=================================================================================================================================
router.post('/send', function(req, res, next) {
  sendToAddr = req.body.toAddr;
  editAddr = bitcore.Address.fromString(sendToAddr); //new Address(toAddr); Address.fromString(toAddr.toString());
  amount = req.body.amount;
  console.log(sendToAddr);
  console.log(editAddr);
  console.log(amount);

  function checkAddres(){
    if(/^[2mn][1-9A-HJ-NP-Za-km-z]{26,35}/.test(sendToAddr)) {
      lalala = addrFromPrKey.toString();
      client.listUnspent(1, 9999999, [addrFromPrKey.toString()], function(err, response){
        console.log(response);
        console.log(err);
        listUnsp = response;
        for(var i=0; i<listUnsp.length; i++){
          tempAmount+=listUnsp[i].amount;
          if(tempAmount>amount){
            console.log("UCANGO");
            console.log(sendToAddr);
            function fromDataToObject(sendToAddr, amount, lalala) {
              objj[sendToAddr] = amount;
              objj[lalala] = 0.2;
              return objj;
            }
            console.log(fromDataToObject(sendToAddr, amount, lalala));
            client.createRawTransaction([{"txid":listUnsp[0].txid, "vout":listUnsp[0].vout}], fromDataToObject(sendToAddr, amount, lalala), function(err, response){
              console.log("CREATE_TRANS");
              console.log(response);
              client.signRawTransaction(response, function(err, response) {
                console.log("SIGNED");
                console.log(err);
                console.log(response);
              });
            });
          }
        }
      });
      res.status(400).send("Not Enough Money");
    }
    else {
      res.status(400).send("bad address!");
    }
  }
  checkAddres();
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
        break;
      }
    }
  });
});

module.exports = router;
