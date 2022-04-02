const dsa = require('./00_setup');

function delay(ms) {
  return new Promise( resolve => setTimeout(resolve, ms) );
}

function onError(error){
  console.log("============onError=================")  
  console.log(error) 
}


function onReceipt(receipt){
  console.log("============onReceipt=================")  
  console.log(receipt)  
}

function onConfirmation(confirmationNumber, receipt, latestBlockHash){
  console.log("============onConfirmation=================")  
  console.log("confirmationNumber:", confirmationNumber)
  // console.log(receipt)
  console.log("latestBlockHash:",latestBlockHash)  
}

function onError(error){
  console.log("============onError=================")  
  console.log(error) 
}

async function main() {

  await dsa.attachAccount(1)

  let addr = await dsa.getAccountAddress(1)

  console.log(addr)

  await dsa.cleanLong(
    {
      gasPrice: await dsa.web3.eth.getGasPrice(),
      leverageToken:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      targetToken:"0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      amountFlashLoan: dsa.web3.utils.toWei("110"), // leverageToken to payback 10.8 - 20
      unitAmt:  1,
      rateMode: 2,
      // onReceipt:onReceipt,
      onConfirmation:onConfirmation,
      // onError:onError
      onEstimateGasError:onError
    }
  );

  balance = await dsa.erc20.balanceOf("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
  console.log("DSA's DAI:", balance)

  await delay(100000)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });