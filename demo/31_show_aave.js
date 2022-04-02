const dsa = require('./00_setup');

async function main() {

  await dsa.attachAccount(1)

  deposits = await dsa.getDeposits()
  console.log(deposits)


  borrows = await dsa.getBorrows()
  console.log(borrows)

  // userdata = await dsa.getUserData()
  // console.log(userdata)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });