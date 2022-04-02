const Web3 = require('web3')
const DSA = require('../dist');
require('dotenv').config({ path: '.env' })


console.log(process.env.PRIVATE_KEY)


// const ETH_NODE_URL = "https://kovan.infura.io/v3/"
const ETH_NODE_URL = "https://eth-mainnet.alchemyapi.io/v2/yUqYgWE1zcEKBuK1KfIpYgA5YnKSe-V_"
// const ETH_NODE_URL = "https://mainnet.infura.io/v3/"
const web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE_URL))
const dsa = new DSA(
    {
        web3: web3,
        mode: "node",
        privateKey: process.env.PRIVATE_KEY
    },
    1
);

module.exports = dsa

