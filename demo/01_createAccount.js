const dsa = require('./00_setup');



async function main() {

  das = dsa.createAccount(
    {
      accountType: 2
    }
  )

  txhash = await das

  console.log(txhash)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });