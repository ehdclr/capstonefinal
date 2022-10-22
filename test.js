const indy = require('./indy/index');
const sdk = require('indy-sdk');
const dotenv = require('dotenv');
dotenv.config();
let poolName = process.env.POOL_NAME;
exports.test = async function () {
  let poolConfig = {
    "genesis_txn": await indy.pool.getPoolGenesisTxnPath(poolName)
  }
  
  await sdk.setProtocolVersion(2)
  try {
    
    await sdk.createPoolLedgerConfig(poolName, poolConfig)
        .catch(e => {
            console.log("ERROR : ", e)
            process.exit()
        })
  } catch (err) {
    throw err
  };
  
}

exports.test();