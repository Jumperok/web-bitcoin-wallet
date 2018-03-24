const Client = require('bitcoin-core');

module.exports = new Client({ network: 'testnet', username: 'test', password: 'test123', host: 'localhost' });
