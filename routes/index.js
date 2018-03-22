var express = require('express');
var router = express.Router();
var bitcore = require("bitcore-lib");
//var explo = require("bitcore-explorers");
const Client = require('bitcoin-core');
const client = new Client({ network: 'testnet', username: 'test', password: 'test123', host: 'localhost' }); //, headers: 'true', port: '8332'

var prK;
var addr;
var bal;
var shell = {};
var toAddr;
var amount;
var numOfUnspentOutputs;
var tempSatoshi = 0;
var editAddr;
var insight;
var WIFkey;
var listUnsp;
var tempAmount = 0;
var lalala;
var objj = {};
var modPrK;

bitcore.Networks.defaultNetwork = bitcore.Networks.testnet; // to settings module

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Bitcoin wallet' });
});

router.get('/send', function(req, res, next) {
  res.render('send', { address: addr, balance: bal });
});

router.post('/send', function(req, res, next) {
  toAddr = req.body.toAddr;
  editAddr = bitcore.Address.fromString(toAddr); //new Address(toAddr); Address.fromString(toAddr.toString());
  amount = req.body.amount;
  console.log(toAddr);
  console.log(editAddr);
  console.log(amount);

  function checkAddres(){
    if(/^[2mn][1-9A-HJ-NP-Za-km-z]{26,35}/.test(toAddr)) {
      lalala = addr.toString();
      client.listUnspent(1, 9999999, [addr.toString()], function(err, response){
        console.log(response);
        console.log(err);
        listUnsp = response;
        for(var i=0; i<listUnsp.length; i++){
          tempAmount+=listUnsp[i].amount;

          if(tempAmount>amount){
            console.log("UCANGO");

            console.log(toAddr);

            function fromDataToObject(toAddr, amount, lalala) {
              objj[toAddr] = amount;
              objj[lalala] = 0.2;
              return objj;
            }

            console.log(fromDataToObject(toAddr, amount, lalala));

            client.createRawTransaction([{"txid":listUnsp[0].txid, "vout":listUnsp[0].vout}], fromDataToObject(toAddr, amount, lalala), function(err, response){
              console.log("CREATE_TRANS");
              console.log(response);
              client.signRawTransaction(response, function(err, response) {
                console.log("SIGNED");
                console.log(err);
                console.log(response);

                // client.sendRawTransaction(res.hex, function(err, res) {
                //   console.log("TRANS_ID");
                //   console.log(err);
                //   console.log(res);
                // });
              });
            });
          }

        }
        res.status(200).send("ITS_ALL_OK");

        //console.log(listUnsp);
      });
      // console.log("123");
      // console.log(listUnsp);
      // console.log("123");
      // console.log(listUnsp[0]);




      // numOfUnspentOutputs = shell.utxos.length;
      // console.log(numOfUnspentOutputs);
      // var tx = bitcore.Transaction();
      // for(var i=0; i<numOfUnspentOutputs; i++){ // считаем хватит ли нам денег
      //   tempSatoshi += shell.utxos[i].satoshis;
      //   tx.from(shell.utxos[i]);
      //   if(tempSatoshi>amount) {
      //     console.log("DONE!!!!!!123132");
      //
      //     tx.fee(50000);
      //     console.log(tx.toObject());
      //     console.log(editAddr);
      //     console.log(amount);
      //
      //     tx.to(editAddr, +amount);
      //
      //     tx.change(addr);
      //     tx.sign(prK);n4dvsPzjpWkqbp72bgzVPrqwsURZSAwhM6
      //     tx.serialize();
      //     console.log(tx.serialize());
      //     console.log(tx.toObject());
      //     insight.broadcast(tx, function(error, txId){
      //       shell.error = error; shell.txId = txId;
      //       console.log(shell.txId);
      //       console.log(shell.txId.toObject());
      //     });
      //     break;
      //   }
      //   res.status(400).send("NO money");
      // }
      res.status(400).send("Not Enough Money");
      //res.status(400).send("NO money");
    }
    else {
      res.status(400).send("bad address!");
    }
  }
  checkAddres();
});



router.post('/', function(req, res, next) {
  prK = req.body.pk;
  //console.log(req.body);
  console.log(prK);
  modPrK = new bitcore.PrivateKey(prK);
  console.log(modPrK);
  function checkPK(){
    if(/\b[A-Fa-f0-9]{64}\b/.test(prK)) {
      console.log("VALID");
      //var newPrKEy = new PrivateKey(prK);
      //console.log(newPrKEy);
      addr = bitcore.PrivateKey(prK).toAddress();
      //var addr22 = bitcore.PrivateKey(prK).toAddress();
      console.log(Object.keys(addr));
      console.log(addr.hashBuffer);
      console.log(addr.toString());
      // console.log(addr.Address);
      //var publicKey = prK.toPublicKey();
      //var addresss = new Address(publicKey, Networks.testnet);
      //console.log(addresss);


      WIFkey = bitcore.PrivateKey(prK).toWIF();
      console.log(WIFkey);



      // for(var i=0; i<listUnsp.length; i++){
      //
      // }

      client.importPrivKey(WIFkey, function(err,res){
        console.log("IMPORT KEY");
        console.log(err);
        console.log(res);
        client.listUnspent(1, 9999999, [addr.toString()], function(err, res){
          console.log(err);
          console.log(res);
        });
      });





      // client.getNetworkInfo(function(err, res){
      //   console.log(err);
      //   console.log(res);
      // });
      // client.getBlockHash(886, function(err,res){
      //   console.log(err);
      //   console.log("lalalalaa");
      //   console.log(res);
      // });



      // client.getBalance('*', 6, function(err, balance, resHeaders) {
      //   if (err) return console.log(err);
      //   console.log('Balance:', balance);
      // });
      // client.getBlockByHash('00000000adb9085dc6b5458cbfc493f1345afb7401da473691e98b6de20fe505', function(err, res){
      //   if(err) return console.log(err);
      //   console.log(res);
      // });
    //).then((help) => console.log(help));
      // insight = new explo.Insight();
      //
      // insight.getUnspentUtxos(addr, function(error, result){
      //   shell.utxos = result;
      //   console.log(shell.utxos);
      // });
      //
      // insight.address(addr, function(error, result) {
      //   console.log(result);
      //   shell.addr = result;
      //   bal = shell.addr.balance;
      //   console.log(bal);
      //   res.status(200).end();
      // });


      // console.log("sadsd");
      //- $('#pass_form').css('display', 'none');
      //console.log(prK.toAddress());
      //- $('#send_form').css('display', 'inline');
      // $('#pass_form').hide();
      // $('#send_form').show();
      res.status(200).send("NO!");
    }
    else {
      // console.log("false");
      res.status(400).send("NO!");
    }
  }
  checkPK();

});

module.exports = router;
