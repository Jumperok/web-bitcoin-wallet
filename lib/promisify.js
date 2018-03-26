// fn -> fn

const promisify = (asyncFunc) => (...args) => {
  console.log('calling async function...');
  return new Promise((resolve, reject) => {
    asyncFunc(...args, (err, result) => {
      console.log('after finishing', result, err);
      err ? reject(err) : resolve(result);
    });
  });
};

module.exports = promisify;
