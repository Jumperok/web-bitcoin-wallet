exports.privateKeyIsValid = function(privateKey) {
  console.log("BEGIN");
  const pkRegExp = /\b[A-Fa-f0-9]{64}\b/;
  console.log(pkRegExp.test(privateKey));
  return pkRegExp.test(privateKey);
};
