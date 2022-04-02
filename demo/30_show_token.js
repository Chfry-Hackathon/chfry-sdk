const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(1)
  let addr = await dsa.getAccountAddress(1)
  console.log(addr)

  console.log("Leverage:")
  leverageToken = await dsa.listLeverageToken()
  console.log(leverageToken)
  
  console.log("Long:")
  longToken = await dsa.listLongToken()
  console.log(longToken)
  
  console.log("Short:")
  shortToken = await dsa.listShortToken()
  console.log(shortToken)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });