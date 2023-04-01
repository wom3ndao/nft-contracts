const main = async () => {
  const nftContractFactory = await hre.ethers.getContractFactory('Wom3nNFT');
  const nftContract = await nftContractFactory.deploy();
  await nftContract.deployed();
  console.log("Contract deployed to:", nftContract.address);
  let allowlist = await nftContract.addToAllowlist(["0x4a7D0d9D2EE22BB6EfE1847CfF07Da4C5F2e3f22", "0x61a5A64861c839f8F4D9fAA1F6b6F06052BA1C1B"])
  await allowlist.wait()
  // console.log("Minted NFT #1")

};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();