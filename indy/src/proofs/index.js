const sdk = require('indy-sdk');
const indy = require('../../index.js');
const dotenv = require('dotenv');
dotenv.config();
let proofRequests;

exports.getproofRequest = async (issuerWallet) => {
  proofRequests = {};
  let transcriptCredDef = await indy.issuer.getCredDefByTag(issuerWallet, 'Id-Cert');
    if(transcriptCredDef) {
      proofRequests['Id-Certificate'] = {
        'name': 'Id-Certificate',
        'version': '0.1',
        'requested_attributes': {
          'attr1_referent': {
            'name': 'first_name',
            'restrictions': [{'cred_def_id': transcriptCredDef.id}]
          },
          'attr2_referent': {
            'name': 'last_name',
            'restrictions': [{'cred_def_id': transcriptCredDef.id}]
          },
          'attr3_referent': {
            'name': 'Identification_Number',
            'restrictions': [{'cred_def_id': transcriptCredDef.id}]
          },
          'attr4_referent': {  
            'name': 'address',
            'restrictions': [{'cred_def_id': transcriptCredDef.id}]
          },
        },
        'requested_predicates': {
          'predicate1_referent': {
            'name': 'age',
            'p_type': '>=',
            'p_value': 20,
            'restrictions': [{'cred_def_id': transcriptCredDef.id}]
          }
        },
        'non_revoked' : {/*"from": 0,*/ "to": indy.utils.getCurrentTimeInSeconds()}
      }
    };
  return proofRequests;
}

exports.sendProofReq = async (issuerWallet) => {
  await exports.getproofRequest(issuerWallet);
  let proofRequest = proofRequests['Id-Certificate']
  proofRequest.nonce = await sdk.generateNonce();
  return proofRequest;
}

exports.createVerificationPresentation = async (issuerWallet, proverWallet, timestampDelta) => {
  let proofRequest = await exports.sendProofReq(issuerWallet);
  let searchForIdCertProofReq = await sdk.proverSearchCredentialsForProofReq(proverWallet, proofRequest, undefined);
  let credsForProof = {};
  let requestedCreds = {
    self_attested_attributes: {},
    requested_attributes: {},
    requested_predicates: {}
  };
  for (let attr of Object.keys(proofRequest.requested_attributes)) {
    let credential = await sdk.proverFetchCredentialsForProofReq(searchForIdCertProofReq, attr, 100)
    let credForAttr = credential[0]['cred_info'];
    credsForProof[`${credForAttr['referent']}`] = credForAttr;
    requestedCreds.requested_attributes[attr] = {
      cred_id: `${credForAttr['referent']}`,
      revealed: true,
      timestamp: timestampDelta
    }
  }
  for (let attr of Object.keys(proofRequest.requested_predicates)) {
    let credential = await sdk.proverFetchCredentialsForProofReq(searchForIdCertProofReq, attr, 100)
    let credForPredicate = credential[0]['cred_info'];
    credsForProof[`${credForPredicate['referent']}`] = credForPredicate;
    requestedCreds.requested_predicates[attr] = {
      cred_id: `${credForPredicate['referent']}`,
      timestamp: timestampDelta
    }
  }
  await sdk.proverCloseCredentialsSearchForProofReq(searchForIdCertProofReq);
  return [proofRequest, credsForProof, requestedCreds];
}

exports.ProverSubmitPresentation = async (proverWallet) => {
  let issuerWallet = await indy.wallet.get(
    process.env.COMMUSERVEICECENTER_WALLET_NAME,
    process.env.COMMUSERVEICECENTER_WALLET_KEY)
  let verifierWallet = await indy.wallet.get(
    process.env.STORE_WALLET_NAME,
    process.env.STORE_WALLET_KEY)
  let issuerDid = await indy.did.getDidFromWallet(issuerWallet);
  let revRegDefId = await indy.did.getEndpointDidAttribute(issuerWallet, 'revocation_registry_id');

  let [proverRevRegDelta, timestampOfDelta] = await indy.ledger.getRevRegDelta(await indy.pool.get(), issuerDid, revRegDefId[0], 0, indy.utils.getCurrentTimeInSeconds());
  let [proofRequest, credsForProof, requestedCreds] = await exports.createVerificationPresentation(issuerWallet, proverWallet, timestampOfDelta);
  
  let message = [proverRevRegDelta, timestampOfDelta, proofRequest, credsForProof, requestedCreds]
  console.log(message);
  let authCryptMessage = await indy.crypto.authCrypt(proverWallet, verifierWallet, message);
  await sdk.closeWallet(issuerWallet);
  await sdk.closeWallet(verifierWallet);
  await sdk.closeWallet(proverWallet);
  return authCryptMessage;
}

exports.verifyProof = async (proverWallet, encryptedMessage) => {
  let verifierWallet = await indy.wallet.get(process.env.STORE_WALLET_NAME, process.env.STORE_WALLET_KEY);
  let verifierDid = await indy.did.getDidFromWallet(verifierWallet);
  let decryptedMessage = await indy.crypto.authDecrypt(verifierWallet, encryptedMessage)
  let userData = JSON.parse(decryptedMessage["message"]);
  
  console.log(typeof userData);
  // let proverWallet = userData[0];
  
  let proverDid = await indy.did.getDidFromWallet(proverWallet);

  let masterSecretId = await indy.crypto.getMasterSecretId(proverWallet);
  let [provSchemas, provCredDefs, provRevocStates] = await indy.ledger.proverGetEntitiesFromLedger(proverWallet, proverDid, userData[3], userData[0], userData[1]);

  let proof = await sdk.proverCreateProof(proverWallet, userData[2], userData[4], masterSecretId, provSchemas, provCredDefs, provRevocStates);
  let [schemas, credDefs, revRegDefs, revRegs] = await indy.ledger.verifierGetEntitiesFromLedger(verifierDid, proof["identifiers"])
  const result = await sdk.verifierVerifyProof(userData[2], proof, schemas, credDefs, revRegDefs, revRegs);
  
  await sdk.closeWallet(proverWallet);
  await sdk.closeWallet(verifierWallet);
  return result
}


// exports.verifyProof = async (encryptedMessage) => {
//   let issuerWallet = await indy.wallet.get(
//     process.env.COMMUSERVEICECENTER_WALLET_NAME,
//     process.env.COMMUSERVEICECENTER_WALLET_KEY)
  
//   let decryptedMessage[message] = await indy.crypto.authDecrypt(verifierWallet, encryptedMessage)
//   let [proverWallet, requestedCreds, timestampOfDelta] = decryptedMessage[message]

//   let verifierWallet = await indy.wallet.get(process.env.STORE_WALLET_NAME, process.env.STORE_WALLET_NAME);
//   let verifierDid = await indy.did.getDidFromWallet(verifierWallet);
//   // let decryptedMessage = await indy.crypto.authDecrypt(verifierWallet, encryptedMessage)
//   let userData = decryptedMessage[message];
//   let proverDid = await indy.did.getDidFromWallet(proverWallet);

//   let masterSecretId = await indy.crypto.getMasterSecretId(proverWallet);
//   let [provSchemas, provCredDefs, provRevocStates] = await indy.ledger.proverGetEntitiesFromLedger(proverWallet, proverDid, userData[4], userData[1], userData[2]);
//   let proof = await sdk.proverCreateProof(proverWallet, userData[3], userData[5], masterSecretId, provSchemas, provCredDefs, provRevocStates);
//   let [schemas, credDefs, revRegDefs, revRegs] = await indy.ledger.verifierGetEntitiesFromLedger(verifierDid, proof["identifiers"])
//   const result = await sdk.verifierVerifyProof(userData[3], proof, schemas, credDefs, revRegDefs, revRegs);
  
//   await sdk.closeWallet(proverWallet);
//   await sdk.closeWallet(verifierWallet);
//   return result
// }



// exports.getRequestedCreds = (proofRequest, credentialsForProofRequest) => {
//   let requestedCreds = {
//     self_attested_attributes: {},
//     requested_attributes: {},
//     requested_predicates: {}
//   };
//   for(let attr of Object.keys(proofRequest.requested_attributes)) {
//     requestedCreds.requested_attributes[attr] = {
//         cred_id: credentialsForProofRequest['attrs'][attr][0]['cred_info']['referent'],
//         revealed: true
//     }
//   }
//   for(let attr of Object.keys(proofRequest.requested_predicates)) {
//     requestedCreds.requested_predicates[attr] = {
//         cred_id: credentialsForProofRequest['attrs'][attr][0]['cred_info']['referent'],
//         revealed: true
//     }
//   }

//   return requestedCreds
// }

// exports.SearchCredential = async () => {
  
// }


// exports.acceptProofReq = async (proverWallet) => {
//   let issuerWallet = await indy.wallet.get(
//     process.env.COMMUSERVEICECENTER_WALLET_NAME,
//     process.env.COMMUSERVEICECENTER_WALLET_KEY)
//   let issuerDid = await indy.did.getDidFromWallet(issuerWallet);
//   let proverDid = await indy.did.getDidFromWallet(proverWallet);
//   let masterSecretId = await indy.crypto.getMasterSecretId(proverWallet);
//   let revRegDefId = await indy.did.getEndpointDidAttribute(issuerWallet, 'revocation_registry_id')
//   let [proverRevRegDelta, timestampOfDelta] = await indy.ledger.getRevRegDelta(await indy.pool.get(), issuerDid, revRegDefId[0], 0, indy.utils.getCurrentTimeInSeconds())
//   let [proofRequest, credsForProof, requestedCreds] = await exports.createVerificationPresentation(issuerWallet, proverWallet, timestampOfDelta)

//   let [schemas, credDefs, revocStates] = await indy.ledger.proverGetEntitiesFromLedger(proverWallet, proverDid, credsForProof, proverRevRegDelta, timestampOfDelta);
//   let proof = await sdk.proverCreateProof(proverWallet, proofRequest, requestedCreds, masterSecretId, schemas, credDefs, revocStates);
//   let proofMessage = {};
//   proofMessage["createdProof"] = proof;
//   proofMessage["proofRequest"] = proofRequest;
  
//   await sdk.closeWallet(proverWallet);
//   await sdk.closeWallet(issuerWallet);
//   return proofMessage;
// }





// exports.verifyProof = async (proofMessage) => {
  

//   let verifierWallet = await indy.wallet.get(process.env.STORE_WALLET_NAME, process.env.STORE_WALLET_NAME);
//   let verifierDid = await indy.did.getDidFromWallet(verifierWallet);
//   let [schemas, credDefs, revRegDefs, revRegs] = await indy.ledger.verifierGetEntitiesFromLedger(verifierDid, proofMessage["createdProof"]["identifiers"])
//   const result = await sdk.verifierVerifyProof(proofMessage["proofRequest"], proofMessage["createdProof"], schemas, credDefs, revRegDefs, revRegs);
  
//   return result
// }
