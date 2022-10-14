'use strict';
const indy = require('../../index.js');
const forge = require('node-forge');

exports.pathToIndyClientHome = () => {
  return require('os').homedir() + "/.indy_client"
}

exports.getCurrentTimeInSeconds = () => {
  return Math.floor(Date.now() / 1000)
}
exports.sleep = (duration) =>{
  return new Promise(resolve => {
      setTimeout(resolve,duration)
  })
}

exports.getTailsWriterConfig = () => {
  let tailsWriterConfig = { "base_dir": indy.utils.pathToIndyClientHome() + "/tails", "uri_pattern": "" };
  return tailsWriterConfig;
}

exports.walletKeyHash = (walletName) => {
  var md = forge.md.sha256.create();
  md.update(walletName);
  md.digest().toHex();
}
