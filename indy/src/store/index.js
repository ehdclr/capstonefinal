const fs = require('fs');
const uuid = require('uuid');
const homedir = require('home-dir');

const BASE = JSON.stringify({
  pendingCredentialOffers: [],
  pendingCredentialRequests: [],
  pendingProofRequests: []
});

let store;

function init(walletName) {
  const PATH = homedir('/.indy_client/' + walletName + '_store.json');
  if (!store) {
    if (!fs.existsSync(PATH)) {
      fs.writeFileSync(PATH, BASE);
    }
    store = JSON.parse(fs.readFileSync(PATH));
  }
}

function syncChanges() {
  fs.writeFileSync(PATH, JSON.stringify(store));
}

exports.pendingCredentialOffers = {
  getAll: function () {
      init();
      return store.pendingCredentialOffers;
  },
  write: function (credOffer) {
      init();
      let id = uuid();
      store.pendingCredentialOffers.push({
          id: id,
          offer: credOffer
      });
      syncChanges();
      return id;
  },
  clear: function () {
      init();
      store.pendingCredentialOffers = [];
      syncChanges();
  },
  delete: function (id) {
      init();
      for (let i = 0; i < store.pendingCredentialOffers.length; i++) {
          if (store.pendingCredentialOffers[i].id === id) {
              store.pendingCredentialOffers.splice(i, 1);
          }
      }
      syncChanges();
  }
};