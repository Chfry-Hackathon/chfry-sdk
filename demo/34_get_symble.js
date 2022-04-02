const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(1)

  symbol = await dsa.erc20.symbol('0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48')
  console.log(symbol)
  console.log(dsa.web3.utils.fromWei("783369300000000000"))
  console.log(dsa.web3.utils.fromWei("1000000000000000000000"))
  console.log(dsa.web3.utils.fromWei("3075200000000000000000"))

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });