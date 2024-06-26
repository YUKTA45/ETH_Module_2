const hre = require("hardhat");

async function main() {
  const BookStore = await hre.ethers.getContractFactory("BookStore");
  const bookStore = await BookStore.deploy("Sample Book", 100); // Initialize with book name and stock
  await bookStore.deployed();

  console.log(`BookStore deployed to: ${bookStore.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
