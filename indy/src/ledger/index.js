'use strict';

const sdk = require('indy-sdk');
const indy = require('../../index.js');

exports.sendNym = async function (poolHandle, walletHandle, Did, newDid, newKey, role) {
  let nymRequest = await sdk.buildNymRequest(Did, newDid, newKey, null, role);
  await sdk.signAndSubmitRequest(poolHandle, walletHandle, Did, nymRequest);
}

// exports.sendNymTest = async function (poolHandle, walletHandle, Did, newDid, newKey, roll) {
//   let nymRequest = await sdk.buildNymRequest(Did, newDid, newKey, null, role);
//   await sdk.signAndSubmitRequest(poolHandle, walletHandle, Did, nymRequest);
// }


exports.sendSchema = async function (poolHandle, walletHandle, Did, schema) {
  // schema = JSON.stringify(schema); // FIXME: Check JSON parsing
  let schemaRequest = await sdk.buildSchemaRequest(Did, schema);
  await sdk.signAndSubmitRequest(poolHandle, walletHandle, Did, schemaRequest)
}

exports.sendCredDef = async function (poolHandle, walletHandle, did, credDef) {
  let credDefRequest = await sdk.buildCredDefRequest(did, credDef);
  await sdk.signAndSubmitRequest(poolHandle, walletHandle, did, credDefRequest);
}

exports.sendRevRegDef = async function (poolHandle, walletHandle, did, RevocRegDef) {
  let RevocRegDefRequest = await sdk.buildRevocRegDefRequest(did, RevocRegDef);
  await sdk.signAndSubmitRequest(poolHandle, walletHandle, did, RevocRegDefRequest);
}

exports.sendRevRegEntry = async function(poolHandle, walletHandle, did, revocRegDefId, RevocRegEntry) {
  let RevocRegEntryRequest = await sdk.buildRevocRegEntryRequest(did, revocRegDefId, "CL_ACCUM", RevocRegEntry);
  await sdk.signAndSubmitRequest(poolHandle, walletHandle, did, RevocRegEntryRequest); 
}

exports.getSchema = async function (poolHandle, did, schemaId) {
  let getSchemaRequest = await sdk.buildGetSchemaRequest(did, schemaId);
  let getSchemaResponse = await sdk.submitRequest(poolHandle, getSchemaRequest);
  const [schema_Id, schema] = await sdk.parseGetSchemaResponse(getSchemaResponse);
  return [schema_Id, schema]
}

exports.getCredDef = async function (poolHandle, did, credDefId) {
  let getCredDefRequest = await sdk.buildGetCredDefRequest(did, credDefId);
  let getCredDefResponse = await sdk.submitRequest(poolHandle, getCredDefRequest);
  const [cred_Def_Id, credDef] = await sdk.parseGetCredDefResponse(getCredDefResponse);
  return [cred_Def_Id, credDef]
}

exports.getRevRegDef = async function (poolHandle, did, revRegDefId) {
  const getRevocRegDefRequest = await sdk.buildGetRevocRegDefRequest(did, revRegDefId)
  const getRevocRegDefResponse = await sdk.submitRequest(poolHandle, getRevocRegDefRequest)
  const [revRegDef_Id, revRegDef] = await sdk.parseGetRevocRegDefResponse(getRevocRegDefResponse)
  return [revRegDef_Id, revRegDef]
}

exports.getRevReg = async function (poolHandle, did, RevRegDefId, verifierTimeStamp) {
  let getRevocRegRequest = await sdk.buildGetRevocRegRequest(did, RevRegDefId, verifierTimeStamp);
  let getRevocRegResponse = await sdk.submitRequest(poolHandle, getRevocRegRequest);
  const [, revRegValue, timestamp] = await sdk.parseGetRevocRegResponse(getRevocRegResponse);
  return [revRegValue, timestamp]
}

exports.getRevRegDelta = async function (poolHandle, did, RevRegDefId, from, to) {
  let getRevocRegDeltaRequest = await sdk.buildGetRevocRegDeltaRequest(did, RevRegDefId, from, to)
  let getRevocRegDeltaResponse = await sdk.submitRequest(poolHandle, getRevocRegDeltaRequest);
  const [, revRegValue, timestamp] = await sdk.parseGetRevocRegDeltaResponse(getRevocRegDeltaResponse);
  return [revRegValue, timestamp]
}

exports.getVerinym = async function (poolHandle, From, fromWallet, fromDid, fromToKey, to, toWallet, toFromDid, toFromKey, role) {
  console.log(`\"${to}\" > Create and store in Wallet \"${to}\" new DID"`);
  let [toDid, toKey] = await sdk.createAndStoreMyDid(toWallet, {});
  console.log(`\"${to}\" > Authcrypt \"${to} DID info\" for \"${From}\"`);
  let didInfoJson = JSON.stringify({
    'did': toDid,
    'verkey': toKey
  });
  let authcryptedDidInfo = await sdk.cryptoAuthCrypt(toWallet, toFromKey, fromToKey, Buffer.from(didInfoJson, 'utf8'));
  console.log('help', authcryptedDidInfo);
  console.log(`\"${to}\" > Send authcrypted \"${to} DID info\" to ${From}`);
  console.log(`\"${From}\" > Authdecrypted \"${to} DID info\" from ${to}`);
  let [senderVerkey, authdecryptedDidInfo] =
    await sdk.cryptoAuthDecrypt(fromWallet, fromToKey, Buffer.from(authcryptedDidInfo));

  let authdecryptedDidInfoJson = JSON.parse(Buffer.from(authdecryptedDidInfo));
  console.log(`\"${From}\" > Authenticate ${to} by comparision of Verkeys`);
  let retrievedVerkey = await sdk.keyForDid(poolHandle, fromWallet, toFromDid);
  if (senderVerkey !== retrievedVerkey) {
    throw Error("Verkey is not the same");
  }
  console.log(`\"${From}\" > Send Nym to Ledger for \"${to} DID\" with ${role} Role`);
  await sendNym(poolHandle, fromWallet, fromDid, authdecryptedDidInfoJson['did'], authdecryptedDidInfoJson['verkey'], role);
  return toDid;
};

exports.proverGetEntitiesFromLedger = async function(proverWallet, submitDid, identifiers, revRegDelta, timestampOfDelta) {
  let schemas = {};
  let credDefs = {};
  let revStates = {};

  const blobStorageReaderHandle = await sdk.openBlobStorageReader('default', indy.utils.getTailsWriterConfig());
  let revId = await indy.did.getEndpointDidAttribute(proverWallet, 'rev_id')

  for (let referent of Object.keys(identifiers)) {
  let item = identifiers[referent];
  let [receivedSchemaId, receivedSchema] = await indy.ledger.getSchema(await indy.pool.get(), submitDid, item['schema_id']);
    schemas[receivedSchemaId] = receivedSchema;

  let [receivedCredDefId, receivedCredDef] = await indy.ledger.getCredDef(await indy.pool.get(), submitDid, item['cred_def_id']);
    credDefs[receivedCredDefId] = receivedCredDef;
  let [receivedRevRegDefId, receivedRevRegDef] = await indy.ledger.getRevRegDef(await indy.pool.get(), submitDid, item['rev_reg_id']);
  let revState = await sdk.createRevocationState(blobStorageReaderHandle, receivedRevRegDef, revRegDelta, timestampOfDelta, revId[0]);
    revStates = {
      [receivedRevRegDefId]: {
        [timestampOfDelta]: revState
      }
    };
  };

  return [schemas, credDefs, revStates];
};

exports.verifierGetEntitiesFromLedger = async function(submitDid, identifiers) {
  let schemas = {};
  let credDefs = {};
  let revRegDefs = {};
  let revRegs = {};
  
  for(let referent of Object.keys(identifiers)) {
    let item = identifiers[referent];
    let [receivedSchemaId ,receivedSchema] = await indy.ledger.getSchema(await indy.pool.get(), submitDid, item['schema_id']);
    schemas[receivedSchemaId] = receivedSchema;

    let [receivedCredDefId, receivedCredDef] = await indy.ledger.getCredDef(await indy.pool.get(), submitDid, item['cred_def_id']);
    credDefs[receivedCredDefId] = receivedCredDef;

    let [receivedRevRegDefId, receivedRevRegDef] = await indy.ledger.getRevRegDef(await indy.pool.get(), submitDid, item['rev_reg_id'])
    
    let [revRegValue,] = await indy.ledger.getRevReg(await indy.pool.get(), submitDid, receivedRevRegDefId, item.timestamp)
  
    revRegDefs[receivedRevRegDefId] = receivedRevRegDef;  
    revRegs = {
      [receivedRevRegDefId]: {
        [item.timestamp] : revRegValue
      }
    }
  }
  return [schemas, credDefs, revRegDefs, revRegs];
};













  // for (let referent in identifiers) {
  //   let item = identifiers[referent];
  //   console.log(item);
  //   let [receivedSchemaId, receivedSchema] = await indy.ledger.getSchema(await indy.pool.get(), submitDid, item['schema_id']);
  //     schemas[receivedSchemaId] = receivedSchema;
  //   console.log(receivedSchemaId)
  //   let [receivedCredDefId, receivedCredDef] = await indy.ledger.getCredDef(await indy.pool.get(), submitDid, item['cred_def_id']);
  //     credDefs[receivedCredDefId] = receivedCredDef;

  //   console.log(receivedCredDefId);
  //   let [receivedRevRegDefId, receivedRevRegDef] = await indy.ledger.getRevRegDef(await indy.pool.get(), submitDid, item['rev_reg_id']);

  //   console.log(receivedRevRegDefId);

  //   console.log(123123123)

  //   let revState = await sdk.createRevocationState(blobStorageReaderHandle, receivedRevRegDef, revRegDelta, timestampOfDelta, revId[0]);
  //   console.log(revState)
    
  //   revStates = {
  //     [receivedRevRegDefId]: {
  //       [timestampOfDelta]: revState
  //     }
  //   };
  // }