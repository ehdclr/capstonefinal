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
  let storeVerkey = [];
  storeVerkey.push(await sdk.keyForLocalDid(recipientWallet, await indy.did.getDidFromWallet(recipientWallet)));
  console.log(storeVerkey)
  
  let t1 = Buffer.from(JSON.stringify(message))
  //wh, message, receiverKeys, senderVK 
  let buffer = await sdk.packMessage(senderWallet,  t1, storeVerkey, userVerkey);
  console.log(buffer)
  return buffer
};

exports.authDecrypt = async function (recipientWallet, message) {
  // let recipientVerkey = await sdk.keyForLocalDid(recipientWallet, myDid);
  console.log(recipientWallet, message)
  let uint8 = new Uint8Array(Buffer.from(message));
  console.log(uint8);
  let decryptedMessageBuffer = await sdk.unpackMessage(recipientWallet, uint8);
  console.log(decryptedMessageBuffer)

  let buffer = Buffer.from(decryptedMessageBuffer).toString('utf-8');
  console.log("dwqdqwd", JSON.parse(buffer))
  
  return JSON.parse(buffer);
};
