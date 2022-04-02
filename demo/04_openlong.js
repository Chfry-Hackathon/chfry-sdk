const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(1)

  let addr = await dsa.getAccountAddress()

  console.log(addr)

  await dsa.openLong(
    {
      gasPrice: await dsa.web3.eth.getGasPrice(),
      leverageToken:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      targetToken:"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      amountLeverageToken: 10000000,
      amountFlashLoan: 2000000, //amountLeverageToken + amountFlashLoan + FlashLoanFee = swap(targetToken) + splipage
      unitAmt:  "0",
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