const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(1)
  
  ETH_APY = await dsa.getAPYAndAPR("0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE")

  console.log(ETH_APY)

  DAI_APY = await dsa.getAPYAndAPR("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")

  console.log(DAI_APY)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });