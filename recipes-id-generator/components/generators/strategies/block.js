const R = require('ramda');
const { BlockArray } = require('block-sequence');
const init = require('block-sequence-mongo');

module.exports = (options) => new Promise((resolve, reject) => {

  let idGenerator;

  const name = options.block.sequence.name;

  const generate = () => new Promise((resolve, reject) => {
    idGenerator.next((err, id) => {
      if (err) return reject(err);
      resolve(id);
    });
  });

  const mongoOptions = {};

  init({ url: options.url, options: mongoOptions }, (err, driver) => {
    if (err) return reject(err);
    driver.ensure({ name }, (err, sequence) => {
      if (err) return reject(err);
      const driverOpts = { block: { sequence, driver, size: options.size }};
      const blockConfig = R.merge(options, driverOpts);
      idGenerator = new BlockArray(blockConfig);
      resolve(generate);
    });
  });

});
