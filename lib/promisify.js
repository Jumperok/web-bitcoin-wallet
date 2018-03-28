// fn -> fn

const promisify = (asyncFunc) => (...args) => {
  return new Promise((resolve, reject) => {
    asyncFunc(...args, (err, result) => {
      err ? reject(err) : resolve(result);
    });
  });
};

module.exports = promisify;
