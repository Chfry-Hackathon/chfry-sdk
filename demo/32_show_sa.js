const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(1)
  let addr = await dsa.getAccountAddress(1)
  
  console.log("ETH:", dsa.web3.utils.fromWei(await dsa.getBalance()))

  balance = await dsa.erc20.balanceOf("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
  console.log("DAI:", dsa.web3.utils.fromWei(balance))

  balance = await dsa.erc20.balanceOf("0xD1B98B6607330172f1D991521145A22BCe793277")
  console.log("WBTC:", dsa.web3.utils.fromWei(balance))

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });