const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(1)

  let addr = await dsa.getAccountAddress(1)

  console.log(addr)

  await dsa.cleanShort(
    {
      gasPrice: await dsa.web3.eth.getGasPrice(),
      leverageToken:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      targetToken:"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      amountWithdraw: dsa.web3.utils.toWei("11"),
      amountFlashLoan: dsa.web3.utils.toWei("1.7"),
      // amountWithdraw: "2931897313042379700000",
      // amountFlashLoan: "1574154381010000000000",
      // unitAmt:  "3893127907591492445940",
      unitAmt:  dsa.web3.utils.toWei("300000000000000000000000000000"),
      rateMode: 2
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