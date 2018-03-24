var express = require('express');
var router = express.Router();

const login = require('./login');
const send = require('./send');
//var explo = require("bitcore-explorers");


var addr;
var bal = 0;
var shell = {};
var sendToAddr;
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

router.use(login);
router.use(send);

//=============================================================================================================================


module.exports = router;
