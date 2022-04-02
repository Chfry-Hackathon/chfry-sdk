const dsa = require('./00_setup');

async function main() {


  addr = await dsa.getDsaWithTypeID(1)
  console.log(addr)

  addr = await dsa.getDsaWithTypeID(2)
  console.log(addr)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });