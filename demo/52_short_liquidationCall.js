const dsa = require('./00_setup');
const Web3 = require('web3')
const DaiTokenABI = require('./DAItoken.json')
const LendingPoolAddressesProviderABI = require('./LendingPoolAddressesProvider.json')
const LendingPoolABI = require('./LendingPool.json')

// Input variables
const collateralAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'
const daiAmountInWei = dsa.web3.utils.toWei("1000", "ether").toString()
const mrkAddress = '0xF7190d0ed47b3E081D16925396A03363DdB82281' // mainnet DAI
const user = '0x734947e5884bc35b903E426E543E05cACe72534c'
const receiveATokens = false

const lpAddressProviderAddress = '0x8bD206df9853d23bE158A9F7065Cf60A7A5F05DF' // mainnet
const lpAddressProviderContract = new dsa.web3.eth.Contract(LendingPoolAddressesProviderABI, lpAddressProviderAddress)

// Get the latest LendingPool contract address


async function main() {

  const lpAddress = await lpAddressProviderContract.methods
    .getLendingPool()
    .call()
    .catch((e) => {
        throw Error(`Error getting lendingPool address: ${e.message}`)
    })

  // Approve the LendingPool address with the DAI contract
  const tx = await dsa.erc20.approve(
    {
      token: mrkAddress,
      amount: dsa.web3.utils.toWei('100000'),
      to: lpAddress,
      gasPrice: await dsa.web3.eth.getGasPrice(),
    })
  console.log(tx)

  // Make the deposit transaction via LendingPool contract
  const ETH_NODE_URL = "https://eth-kovan.alchemyapi.io/v2/zLIYrNJ8ojafxuDenF9rk9JIVG8uUu7u"
  const web3 = new Web3(new Web3.providers.HttpProvider(ETH_NODE_URL))
  web3.eth.accounts.wallet.add('0xca9d81f4b2ce6dc7e9783334bac8be379891e1741b47e1015a299f200b904cc7');
  const lpContract = new web3.eth.Contract(LendingPoolABI, lpAddress)
  console.log(lpAddress)
  let gasPrice = await web3.eth.getGasPrice()
  console.log(gasPrice)
  await lpContract.methods
    .liquidationCall(
        collateralAddress,
        mrkAddress,
        user,
        dsa.web3.utils.toWei('1'),
        receiveATokens,
    )
    .send({from: '0xddaFE4A9Ab0d97D02F26e7d49981F42D2c4c1F01', gas: '30000000'})
    .catch((e) => {
        throw Error(`Error liquidating user with error: ${e.message}`)
    })
    // daiAmountInWei,//unit(-1)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });