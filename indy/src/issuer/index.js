'use strict';
const sdk = require('indy-sdk');
const indy = require('../../index.js');
const dotenv = require('dotenv');

dotenv.config();



exports.createCredDef = async function (schemaId, tag) {
  let schema = await indy.ledger.getSchema(ph, did, schemaId);

  await indy.did.getDid(walletName, walletKey)
  
  let issuerWalletName = process.env.COMMUSERVEICECENTER_WALLET_NAME;
  let issuerWalletKey = process.env.COMMUSERVEICECENTER_WALLET_KEY;

  await sdk.listMyDidsWithMeta(indy.wallet.get(issuerWalletName, issuerWalletKey))
  
  
  // await sdk.issuerCreateAndStoreCredentialDef(await indy.wallet.get(issuerWalletName, issuerWalletKey), await indy.did.getDid() schema tag 'CL','{"support_revocation": true}')
}

exports.getCredDefByTag = async function (walletName, credDefTag) {
  let credDefs = await indy.did.getEndpointDidAttribute(walletName,
    "credential_definitions"
  );
  for (let credDef of credDefs) {
    if (credDef.tag === credDefTag) {
      return credDef;
    }
  }
};