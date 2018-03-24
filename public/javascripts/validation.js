exports.privateKeyIsValid = function(privateKey) {
  const pkRegExp = /\b[A-Fa-f0-9]{64}\b/;
  console.log(pkRegExp.test(privateKey));
  return pkRegExp.test(privateKey);
};

exports.addressIsValid = function(address) {
  const addrRegExp = /^[2mn][1-9A-HJ-NP-Za-km-z]{26,35}/;
  console.log(addrRegExp.test(address));
  return addrRegExp.test(address);
};
