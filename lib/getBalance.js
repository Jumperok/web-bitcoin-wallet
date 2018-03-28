const db = require('../db');

const getBalance = (listUnspent) => {
  const balance = listUnspent.reduce((acc, current) => {
    acc += current.amount;
    return acc;
  }, 0);
  db.set('balance', balance.toFixed(8));
}

module.exports = getBalance;
