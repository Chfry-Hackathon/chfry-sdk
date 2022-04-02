const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(1)

  let addr = await dsa.getAccountAddress(1)

  console.log(addr)

  await dsa.claimStkReward(
    {
      gasPrice: await dsa.web3.eth.getGasPrice(),
      tokens:["0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"],
    }
  );
  
  balance = await dsa.erc20.balanceOf("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
  console.log("DSA's DAI:", balance)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });