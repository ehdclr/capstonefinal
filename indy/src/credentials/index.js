'use strict';
const sdk = require('indy-sdk');
const indy = require('../../index');
const dotenv = require("dotenv");

dotenv.config();

exports.getCredential = async (wallet) => {
  let issuerWallet = await indy.wallet.get(process.env.COMMUSERVEICECENTER_WALLET_NAME, process.env.COMMUSERVEICECENTER_WALLET_KEY)
  let schemaId = await indy.did.getEndpointDidAttribute(issuerWallet, "schemas");
  let filter = {"schema_id" : schemaId}
  let cred = await sdk.proverGetCredentials(wallet, filter);
  let credValue = cred['attrs'];
  await sdk.closeWallet(issuerWallet);
  await sdk.closeWallet(wallet);
  return credValue;
}

//(createDid). 1. 2. 3
exports.CreateCredentialProcess = async (walletName, walletKey, value) => {
  try {
    let seedInfo = await indy.utils.walletKeyHash(walletName, walletKey);
    console.log(seedInfo);
    let proverWallet = await indy.wallet.get(walletName, walletKey);
    let issuerWallet = await indy.wallet.get(process.env.COMMUSERVEICECENTER_WALLET_NAME, process.env.COMMUSERVEICECENTER_WALLET_KEY);
    let [userDid, userVerkey] = await indy.did.createDid(seedInfo, proverWallet);
    let credOffer = await exports.sendCredOffer(issuerWallet)
    let [credReq, credReqMetaData] = await exports.sendCreateCredReq(proverWallet, credOffer)
    let [credential, revId, revRegDelta, credId] = await indy.credentials.acceptRequestCreateCredential(proverWallet, issuerWallet, credOffer, credReq, credReqMetaData, value);
    await sdk.closeWallet(issuerWallet);
    return [proverWallet, userDid, userVerkey, credential, revId, revRegDelta, credId]
  } catch (e) {
    throw e;
  }
}

// exports.createSeedInfo = async (walletName, secPassword) => {
//   let seedinfo = walletName + secPassword;
// }

//1
exports.sendCredOffer = async (issuerWallet) => {
  const credDefId = await indy.did.getEndpointDidAttribute(issuerWallet, 'credential_definitions');
  let credOffer = await sdk.issuerCreateCredentialOffer(issuerWallet, credDefId[0].id);
  return credOffer;
};
//2
exports.sendCreateCredReq = async (proverWallet, credOffer) => {
  let [, credDef] = await indy.ledger.getCredDef(await indy.pool.get(), await indy.did.getDidFromWallet(proverWallet), credOffer.cred_def_id);
  let masterSecretId = await indy.crypto.getMasterSecretId(proverWallet);
  let [credReq, credReqMetaData] = await sdk.proverCreateCredentialReq(proverWallet, (await indy.did.getDidFromWallet(proverWallet)), credOffer, credDef, masterSecretId);
  return [credReq, credReqMetaData];
};
//3
exports.acceptRequestCreateCredential = async (proverWallet, issuerWallet, credOffer, credReq, credReqMetaData, valueData) => {
  const issuerDid = await indy.did.getDidFromWallet(issuerWallet);
  
  // schema, credDef, revRegDef setup
  let [, schema] = await indy.ledger.getSchema(await indy.pool.get(), issuerDid, credOffer.schema_id)
  let [, credDef] = await indy.ledger.getCredDef(await indy.pool.get(), issuerDid, credReq.cred_def_id)
  let revRegDefId = (await indy.did.getEndpointDidAttribute(issuerWallet, 'revocation_registry_id'))[0]
  let [, revRegDef] = await indy.ledger.getRevRegDef(await indy.pool.get(), issuerDid, revRegDefId)

  //input value값 encoding후 객체로 가공
  let credentialValues = exports.credentialValueProcessing(schema, valueData);
  //해지 레지스트리 tail파일 저장 경로 리더기 핸들
  const blobStorageReaderHandle = await sdk.openBlobStorageReader('default', indy.utils.getTailsWriterConfig());
  //credential 생성
  let [credential, revId, revRegDelta] = await sdk.issuerCreateCredential(issuerWallet, credOffer, credReq, credentialValues, revRegDefId, blobStorageReaderHandle);
  //revocation registry의 최신화된 entry 블록체인에 등록(중요)
  await indy.ledger.sendRevRegEntry(await indy.pool.get(), issuerWallet, issuerDid, revRegDefId, revRegDelta)
  //user wallet에 credential 저장
  let credId = await sdk.proverStoreCredential(proverWallet, null, credReqMetaData, credential, credDef, revRegDef);
  //발급한 vc를 증명할때 rev_id 사용
  await indy.did.pushAttributeFromWallet(proverWallet, 'rev_id', revId);
  
  // await sdk.closeWallet(proverWallet);
  // await sdk.closeWallet(issuerWallet);
  return [credential, revId, revRegDelta, credId]
};

exports.credentialValueProcessing = (schema, valueData) => {
  let credentialValues = {};
  for (let attr of schema.attrNames) {
    if (valueData[attr]) {
      valueData[attr] = { raw: valueData[attr], encoded: indy.credentials.encode(valueData[attr]) };
    }
    credentialValues[attr] = valueData[attr]
  }
  return credentialValues;
};

exports.encode =(string) => {
  // console.log(string);
  if(!string) {
      return string;
  }
  let newString = Buffer.from(string.toString(),'utf8').toString();
  let number = "1";
  let length = newString.length;
  for (let i = 0; i < length; i++) {
      let codeValue = newString.charCodeAt(i).toString(10);
      if(codeValue.length < 3) {
          codeValue = "0" + codeValue;
      }
      number += codeValue;
  }
  // console.log(number);
  return number;
};

exports.decode =(number) => {
  // console.log(number);
  if(!number) return number;
  let string = "";
  number = number.slice(1); // remove leading 1
  let length = number.length;
  for (let i = 0; i < length;) {
      let code = number.slice(i, i += 3);
      string += String.fromCharCode(parseInt(code, 10));
  }
  // console.log(string);
  return string;
};




























// exports.sendCredOffer = async () => {
//   let commuWalletName = process.env.COMMUSERVEICECENTER_WALLET_NAME;
//   let commuWalletKey = process.env.COMMUSERVEICECENTER_WALLET_KEY;
//   let issuerWallet = await indy.wallet.get(commuWalletName, commuWalletKey);
//   const credDefId = await indy.did.getEndpointDidAttribute(issuerWallet, 'credential_definitions');
//   let credOffer = await sdk.issuerCreateCredentialOffer(issuerWallet, credDefId[0].id);
//   await sdk.closeWallet(issuerWallet);
//   return credOffer;
// };

// exports.sendCreateCredReq = async (proverWallet, credOffer) => {
//   let [, credDef] = await indy.ledger.getCredDef(await indy.pool.get(), await indy.did.getDidFromWallet(proverWallet), credOffer.cred_def_id);
//   let masterSecretId = await indy.crypto.getMasterSecretId(proverWallet);
//   let [credReq, credReqMetaData] = await sdk.proverCreateCredentialReq(proverWallet, (await indy.did.getDidFromWallet(proverWallet)), credOffer, credDef, masterSecretId);
//   return [credReq, credReqMetaData];
// };

// exports.acceptRequestCreateCredential = async (proverWallet, credOffer, credReq, credReqMetaData, valueData) => {
//   const commuWalletName = process.env.COMMUSERVEICECENTER_WALLET_NAME;
//   const commuWalletKey = process.env.COMMUSERVEICECENTER_WALLET_KEY;
//   const issuerWallet = await indy.wallet.get(commuWalletName, commuWalletKey)
//   const issuerDid = await indy.did.getDidFromWallet(issuerWallet);
  
//   // schema, credDef, revRegDef setup
//   let [, schema] = await indy.ledger.getSchema(await indy.pool.get(), issuerDid, credOffer.schema_id)
//   let [, credDef] = await indy.ledger.getCredDef(await indy.pool.get(), issuerDid, credReq.cred_def_id)
//   let revRegDefId = (await indy.did.getEndpointDidAttribute(issuerWallet, 'revocation_registry_id'))[0]
//   let [, revRegDef] = await indy.ledger.getRevRegDef(await indy.pool.get(), issuerDid, revRegDefId)

//   //input value값 encoding후 객체로 가공
//   let credentialValues = exports.credentialValueProcessing(schema, valueData);
//   //해지 레지스트리 tail파일 저장 경로 리더기 핸들
//   const blobStorageReaderHandle = await sdk.openBlobStorageReader('default', indy.utils.getTailsWriterConfig());
//   //credential 생성
//   let [credential, revId, revRegDelta] = await sdk.issuerCreateCredential(issuerWallet, credOffer, credReq, credentialValues, revRegDefId, blobStorageReaderHandle);
//   //revocation registry의 최신화된 entry 블록체인에 등록(중요)
//   await indy.ledger.sendRevRegEntry(await indy.pool.get(), issuerWallet, issuerDid, revRegDefId, revRegDelta)
//   //user wallet에 credential 저장
//   let credId = await sdk.proverStoreCredential(proverWallet, null, credReqMetaData, credential, credDef, revRegDef);
//   //발급한 vc를 증명할때 rev_id 사용
//   await indy.did.pushAttributeFromWallet(proverWallet, 'rev_id', revId);
  
//   await sdk.closeWallet(proverWallet);
//   await sdk.closeWallet(issuerWallet);
//   return [credential, revId, revRegDelta, credId]
// }