'use strict';
const sdk = require('indy-sdk');
const indy = require('../../index.js');
const { v4: uuidv4 } = require('uuid');

exports.createMasterSecret = async (wallet) => {
  let masterSecretId = await indy.did.getEndpointDidAttribute(wallet,'master_secret_id' );
  if(!masterSecretId) {
      masterSecretId = uuidv4();
      await sdk.proverCreateMasterSecret(wallet, masterSecretId);
      await indy.did.setEndpointDidAttribute(wallet, 'master_secret_id', masterSecretId);
  }

};
//마스터 시크릿을 credOffer 이후에 만들어서 createCredReq에서 쓰고 proverCreateProof에서도 쓰기 때문에 did의 메타데이터에 저장한 후 사용해야 한다. 
exports.getMasterSecretId = async (wallet) => {
  return await indy.did.getEndpointDidAttribute(wallet, 'master_secret_id');
}


exports.authCrypt = async function (senderWallet, recipientWallet, message) {
  let userVerkey = await sdk.keyForLocalDid(senderWallet, await indy.did.getDidFromWallet(senderWallet));
  let storeVerkey = await sdk.keyForLocalDid(recipientWallet, await indy.did.getDidFromWallet(recipientWallet));
  let buffer = await sdk.packMessage(senderWallet, Buffer.from(message, 'utf8'),  storeVerkey, userVerkey);
  return Buffer.from(buffer).toString('base64')
};

exports.authDecrypt = async function (recipientWallet, message) {
  // let recipientVerkey = await sdk.keyForLocalDid(recipientWallet, myDid);
  let [, decryptedMessageBuffer] = await sdk.unpackMessage(recipientWallet, Buffer.from(message, 'base64'));
  let buffer = Buffer.from(decryptedMessageBuffer).toString('utf8');
  return JSON.parse(buffer);
};
