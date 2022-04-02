const dsa = require('./00_setup');

async function main() {
  console.log(await dsa.getAaveStackReward())
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });