'use strict';
const sdk = require('indy-sdk');
const indy = require('../../index');
const dotenv = require('dotenv');
let wallet;
dotenv.config();

// exports.get = async function(walletName, walletKey) {
//   if(!wallet) {
//       await exports.setup(walletName, walletKey);
//   }
//   return wallet;
// };

exports.get = async function (walletName, walletKey) {
  await exports.setup(walletName, walletKey);
  return wallet;
}

exports.setup = async function (walletName, walletKey) {
  try {
      await sdk.createWallet(
          {id: walletName},
          {key: walletKey}
      );
  } catch (e) {
      if (e.message !== 'WalletAlreadyExistsError') {
          console.warn('create wallet failed with message: ' + e.message);
          throw e;
      }
  } finally {
      console.info('wallet already exist, try to open wallet');
  }
  wallet = await sdk.openWallet(
      {id: walletName},
      {key: walletKey}
  );
};

exports.newRegister = async function (didInfoParam, walletName, walletKey) {
  await sdk.createWallet(
    { id: walletName },
    { key: walletKey }
  );
  return
}





// exports.get = async function (walletName, walletKey) {
  
//   wallet = await exports.setup(walletName, walletKey);
//   return wallet;
// }

// exports.setup = async function (walletName, walletKey) {
//   try {
//     await sdk.createWallet(
//       { id: walletName },
//       { key: walletKey }
//     );
//   } catch (e) {
//     if (e.message !== 'WalletAlreadyExistsError') {
//       console.warn('create Wallet failed with message: ' + e.message);
//       throw e;
//     }
//   } finally {
//     console.info('wallet already exist, try to open wallet');
//   }
//   return await sdk.openWallet(
//     { id: walletName },
//     { key: walletKey }
//   )
// }
