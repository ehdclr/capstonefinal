'use strict';
const sdk = require('indy-sdk');
const indy = require('../../index.js');
const dotenv = require("dotenv");
let endpointDid;
let stewardDid, stewardVerkey, governmentWallet;
let issuerDid, issuerVerkey, communityServiceCenterWallet;
let verifierDid, verifierVerkey, storeWallet;
dotenv.config();

//초기 사용자 did 생성 (세부정보 입력 시 사용, 이후 vc 즉시 발급)

exports.createDid = async function (didInfoParam, proverWallet) {
  let didInfo = { seed: didInfoParam } || {};
  try {
    await indy.did.settingGovernment();
    console.log(didInfo)
    const [UserDid, UserVerkey] = await sdk.createAndStoreMyDid(proverWallet, didInfo);
    let didMeta = JSON.stringify({
      primary: true,
      schemas: [],
      credential_definitions: [],
      revocation_registry_id: [],
    });
    await sdk.setDidMetadata(proverWallet, UserDid, didMeta);
    await indy.ledger.sendNym(await indy.pool.get(), governmentWallet, stewardDid, UserDid, UserVerkey, null)
    console.log(await sdk.listMyDidsWithMeta(proverWallet));
    await indy.crypto.createMasterSecret(proverWallet);
    console.log(await sdk.listMyDidsWithMeta(proverWallet));
    return [UserDid, UserVerkey]
  } catch (e) {
    throw e;
  }
}

exports.getDidFromWallet = async function (wallet) {
  let dids = await sdk.listMyDidsWithMeta(wallet);
  for (let didinfo of dids) {
    let meta = JSON.parse(didinfo.metadata);
    if (meta && meta.primary) {
      endpointDid = didinfo.did;
    }
  }
  return endpointDid;
}

exports.setEndpointDidAttribute = async function (wallet, attribute, item) {
  let did = await indy.did.getDidFromWallet(wallet);
  let metadata = await sdk.getDidMetadata(wallet, did);
  metadata = JSON.parse(metadata);
  metadata[attribute] = item;
  await sdk.setDidMetadata(
    wallet,
    did,
    JSON.stringify(metadata)
  );
};

exports.pushAttributeFromWallet = async function (wallet, attribute, item) {
  let metadata = await sdk.getDidMetadata(wallet, await indy.did.getDidFromWallet(wallet));
  metadata = JSON.parse(metadata);
  if (!metadata[attribute]) {
      metadata[attribute] = [];
  }
  metadata[attribute].push(item);
  await sdk.setDidMetadata(wallet, await indy.did.getDidFromWallet(wallet), JSON.stringify(metadata));
};

exports.getEndpointDidAttribute = async function (wallet, attribute) {
  let metadata = await sdk.getDidMetadata(wallet, await indy.did.getDidFromWallet(wallet));
  metadata = JSON.parse(metadata); 
  return metadata[attribute];
};

exports.getCredDefByTag = async function (wallet, credDefTag) {
  let credDefs = await indy.did.getEndpointDidAttribute(wallet,
    "credential_definitions"
  );
  for (let credDef of credDefs) {
    if (credDef.tag === credDefTag) {
      return credDef;
    }
  }
};

exports.settingGovernment = async function () {
  governmentWallet = await indy.wallet.get(
    process.env.GOVERNMENT_WALLET_NAME,
    process.env.GOVERNMENT_WALLET_KEY
  )
  let governmentDidInfo = {
    'seed': process.env.MASTER_DID_SEED
  };
  [stewardDid, stewardVerkey] = await sdk.createAndStoreMyDid(governmentWallet, governmentDidInfo)
  return [stewardDid, stewardVerkey, governmentWallet]
}

exports.settingCommunityServices = async function () {
  console.log(123)
  communityServiceCenterWallet = await indy.wallet.get(
    process.env.COMMUSERVEICECENTER_WALLET_NAME,
    process.env.COMMUSERVEICECENTER_WALLET_KEY
  );
  console.log(12323)
  let commuServiceCenterDidInfo = {
    'seed': process.env.ISSUER_DID_SEED
  };
  [issuerDid, issuerVerkey] = await sdk.createAndStoreMyDid(communityServiceCenterWallet, commuServiceCenterDidInfo)
  return [issuerDid, issuerVerkey, communityServiceCenterWallet]
}
exports.settingStore = async function () {
  storeWallet = await indy.wallet.get(
    process.env.STORE_WALLET_NAME,
    process.env.STORE_WALLET_KEY
  );
  let storeDidInfo = {
    'seed': process.env.VERIFIER_DID_SEED
  };
  [verifierDid, verifierVerkey] = await sdk.createAndStoreMyDid(storeWallet, storeDidInfo)
  return [verifierDid, verifierVerkey, storeWallet]
}

// exports.createEndpointDid = async function () {
//   await settingGovernment();

//   [endpointDid, publicVerkey] = await sdk.createAndStoreMyDid(
//     await indy.wallet.get(),
//     {}
//   );
  
//   let didMeta = JSON.stringify({
//     primary: true,
//     schemas: [],
//     credential_definitions: [],
//   });
//   await sdk.setDidMetadata(await indy.wallet.get(), endpointDid, didMeta);

//   await indy.pool.sendNym(
//     await indy.pool.get(),
//     stewardWallet,
//     stewardDid,
//     endpointDid,
//     publicVerkey,
//     "TRUST_ANCHOR"
//   );
//   await indy.pool.setEndpointForDid(endpointDid, config.endpointDidEndpoint);
//   await indy.crypto.createMasterSecret();

//   // await issueGovernmentIdCredential();
// };

// exports.getEndpointDid = async function (walletName, walletKey) {
//   if (!endpointDid) {
//     let dids = await sdk.listMyDidsWithMeta(await indy.wallet.get(walletName, walletKey));

//     for (let didinfo of dids) {
//       let meta = JSON.parse(didinfo.metadata);
//       if (meta && meta.primary) {
//         endpointDid = didinfo.did;
//       }
//     }
//     if (!endpointDid) {
//       await exports.createEndpointDid();
//     }
//   }
//   return endpointDid;
// };


// exports.getDid = async function (walletName, walletKey) {
//   let dids = await sdk.listMyDidsWithMeta(await indy.wallet.get(walletName, walletKey));
//   for (let didinfo of dids) {
//     let meta = JSON.parse(didinfo.metadata);
//     if (meta && meta.primary) {
//       endpointDid = didinfo.did;
//     }
//   } 
//   return endpointDid;
// }

// exports.pushEndpointDidAttribute = async function (walletName, walletKey, attribute, item) {
//   let metadata = await sdk.getDidMetadata(await indy.wallet.get(walletName, walletKey), indy.did.getDid(walletName,walletKey));
//   metadata = JSON.parse(metadata);
//   if (!metadata[attribute]) {
//       metadata[attribute] = [];
//   }
//   metadata[attribute].push(item);
//   await sdk.setDidMetadata(await indy.wallet.get(walletName, walletKey), indy.did.getDid(walletName, walletKey) , JSON.stringify(metadata));
// };



