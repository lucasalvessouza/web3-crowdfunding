const main = async () => {
  const factory = await hre.ethers.getContractFactory("Crowdfunding");
  const contract = await factory.deploy();

  await contract.deployed();

  console.log("Crowdfunding address: ", contract.address);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();