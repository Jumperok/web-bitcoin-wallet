const router = require('express').Router();
const bitcore = require('bitcore-lib');
const db = require('../db');
const client = require('../lib/bitcoin-client');
const isValidPK = require('../validation').isValidPrivateKey;
const getBalance = require('../lib/getBalance');
const promisify = require('../lib/promisify');
const importPrivKey = promisify(client.importPrivKey.bind(client));
const listUnspent = promisify(client.listUnspent.bind(client));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});
//=============================================================================================================
router.post('/', function(req, res, next) {
  const privateKeyString = req.body.pk;
  if(isValidPK(privateKeyString)) {
    db.set('addrFromPrKey', bitcore.PrivateKey(privateKeyString).toAddress());
    const WIFkey = bitcore.PrivateKey(privateKeyString).toWIF();
    importPrivKey(WIFkey)
    .then(res => {
      return listUnspent(1, 9999999, [db.get('addrFromPrKey').toString()])
    })
    .then(res => {
      getBalance(res);
    })
    .then(() => {
      console.log(db);
      res.status(200).send();
    })
    .catch(err => {
      console.error(err);
    });
  }
  else {
    res.status(400).send('Private Key is not valid');
  }
});

module.exports = router;
