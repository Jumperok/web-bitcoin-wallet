exports.isValidPrivateKey = privateKey => {
  const pkRegExp = /\b[A-Fa-f0-9]{64}\b/;
  return pkRegExp.test(privateKey);
};

exports.isValidAddress = address => {
  const addrRegExp = /^[2mn][1-9A-HJ-NP-Za-km-z]{26,35}/;
  return addrRegExp.test(address);
};
