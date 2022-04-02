const dsa = require('./00_setup');


function onReceipt(){
  console.log("onReceipt")
}

function onConfirmation(){
  console.log("onConfirmation")
}

const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {

  await dsa.attachAccount(2)
  let saAddress = await dsa.getAccountAddress(2)
  console.log(saAddress)

  const tx = await dsa.erc20.approve(
    {
      token: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      amount: dsa.web3.utils.toWei('100000'),
      to: saAddress,
      gasPrice: await dsa.web3.eth.getGasPrice(),
      onReceipt:onReceipt,
      onConfirmation:onConfirmation
    })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });