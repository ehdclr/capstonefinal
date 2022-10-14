'use strict';
const sdk = require('indy-sdk');
const indy = require('../../index');
const fs = require('fs');
const os = require('os');
let poolHandle;
let path = os.homedir() + "/.indy_client/wallet/governmentWallet";
const dotenv = require('dotenv');

dotenv.config();

//셋업을 했었는지 여부 확인(정부지갑이 있나 확인)
exports.checkAlreadySet = function () {
  return fs.existsSync(path) 
}

//정부, 주민센터 did 생성 및 did, wallet 셋업, 권한있는 did의 메타 데이터 설정, schema, credDef 생성 및 블록체인 등록
exports.setup = async function () {
  try { 
    poolHandle = await indy.pool.get()
    const [governmentDid, governmentKey, governmentWallet] = await indy.did.settingGovernment()
    const [commuServiceCenterDid, commuServiceCenterVerkey, commuServiceCenterWallet] = await indy.did.settingCommunityServices()
    const [storeDid, storeVerkey, storeWallet] = await indy.did.settingStore()
    let didMeta = JSON.stringify({
      primary: true,
      schemas: [],
      credential_definitions: [],
      revocation_registry_id: [],
    });

    await sdk.setDidMetadata(governmentWallet, governmentDid, didMeta);
    await sdk.setDidMetadata(commuServiceCenterWallet, commuServiceCenterDid, didMeta);
    await sdk.setDidMetadata(storeWallet, storeDid, didMeta);

    let [idCertificateSchemaId, idCertificateSchema] = await sdk.issuerCreateSchema(governmentDid, 'Id-Certificate', '1.0',
      ['first_name', 'last_name', 'Identification_Number', 'address', 'age']);
    await indy.ledger.sendSchema(poolHandle, governmentWallet, governmentDid, idCertificateSchema);
    await indy.did.pushAttributeFromWallet(governmentWallet, 'schemas', idCertificateSchemaId);
    [idCertificateSchemaId ,idCertificateSchema] = await indy.ledger.getSchema(poolHandle, governmentDid, idCertificateSchemaId)

    const [idCertCredDefId, idCertCredDef] = await sdk.issuerCreateAndStoreCredentialDef(commuServiceCenterWallet, commuServiceCenterDid, idCertificateSchema, 'Id-Cert', 'CL', { 'support_revocation': true });

    await indy.ledger.sendCredDef(poolHandle, commuServiceCenterWallet, commuServiceCenterDid, idCertCredDef)
    await indy.did.pushAttributeFromWallet(commuServiceCenterWallet,'credential_definitions', idCertCredDef)

    const tailsWriterConfig = indy.utils.getTailsWriterConfig();
    const tailsWriter = await sdk.openBlobStorageWriter('default', tailsWriterConfig);
    const revRegDefConfig = {
      "max_cred_num": 100,
      "issuance_type": "ISSUANCE_ON_DEMAND"
    };

    const [revRegDefId, revRegDef, revRegEntry] = await sdk.issuerCreateAndStoreRevocReg(commuServiceCenterWallet, commuServiceCenterDid, undefined, 'Id-Cert', idCertCredDefId, revRegDefConfig, tailsWriter)

    await indy.ledger.sendRevRegDef(poolHandle, commuServiceCenterWallet, commuServiceCenterDid, revRegDef)
    await indy.ledger.sendRevRegEntry(poolHandle, commuServiceCenterWallet, commuServiceCenterDid, revRegDefId, revRegEntry)
    await indy.did.pushAttributeFromWallet(commuServiceCenterWallet,'revocation_registry_id', revRegDefId)

    await sdk.closeWallet(governmentWallet);
    await sdk.closeWallet(commuServiceCenterWallet);
    await sdk.closeWallet(storeWallet);

    console.log('\n', "schema_Id :", idCertificateSchemaId, '\n', "schema :", idCertificateSchema);
    console.log('\n', "Credential_Def_Id :", idCertCredDefId, '\n', "Credential_Def :", idCertCredDef);
    console.log('\n', "Revocation Registry Definition ID : ", revRegDefId, '\n', "Revocation Registry Definition :", revRegDef)
    return
    //메타데이터 셋업 후 다시 steward를 셋업해도 메타데이터는 그대로 남아있다.
  } catch (err) {

  console.log(err);
  }
}



// exports.createCredDef = async function (schemaId, tag) {
//   let schema = await indy.ledger.getSchema(ph, did, schemaId);

//   await indy.did.getDid(walletName, walletKey)
  
//   let issuerWalletName = process.env.COMMUSERVEICECENTER_WALLET_NAME;
//   let issuerWalletKey = process.env.COMMUSERVEICECENTER_WALLET_KEY;

//   await sdk.listMyDidsWithMeta(indy.wallet.get(issuerWalletName, issuerWalletKey))
  
  
//   await sdk.issuerCreateAndStoreCredentialDef(await indy.wallet.get(issuerWalletName, issuerWalletKey), await indy.did.getDid() schema tag 'CL','{"support_revocation": true}')
// }

