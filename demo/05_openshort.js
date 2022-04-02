const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(2)

  let addr = await dsa.getAccountAddress()

  console.log(addr)

  await dsa.openShort(

    {
      gasPrice: await dsa.web3.eth.getGasPrice(),
      leverageToken:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      targetToken:"0x0F5D2fB29fb7d3CFeE444a200298f468908cC942",
      amountTargetToken: dsa.web3.utils.toWei("2"),
      amountLeverageToken: 1000000,
      amountFlashLoan: 1000000,
      unitAmt:   0,
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