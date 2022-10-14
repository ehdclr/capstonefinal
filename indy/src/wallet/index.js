'use strict';
const sdk = require('indy-sdk');
const indy = require('../../index');
let wallet;
const dotenv = require('dotenv');

dotenv.config();

exports.newRegister = async function (didInfoParam, walletName, walletKey) {
  await sdk.createWallet(
    { id: walletName },
    { key: walletKey }
  );
  return
}

exports.get = async function (walletName, walletKey) {
  wallet = await exports.setup(walletName, walletKey);
  return wallet;
}

exports.setup = async function (walletName, walletKey) {
  try {
    await sdk.createWallet(
      { id: walletName },
      { key: walletKey }
    );
  } catch (e) {
    if (e.message !== 'WalletAlreadyExistsError') {
      console.warn('create Wallet failed with message: ' + e.message);
      throw e;
    }
  } finally {
    console.info('wallet already exist, try to open wallet');
  }
  return await sdk.openWallet(
    { id: walletName },
    { key: walletKey }
  )
}
