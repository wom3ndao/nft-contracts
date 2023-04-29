const { deployContract } = require("@nomiclabs/hardhat-ethers/types");

const ANY = "0x4a7D0d9D2EE22BB6EfE1847CfF07Da4C5F2e3f22";
describe("Wom3nNFT", function () {
  it("should deploy and execute functions", async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('Wom3nNFT');
    const contractDeployed = await nftContractFactory.deploy();
    const owner = await contractDeployed.owner();
    await contractDeployed.addToAllowlist([owner])
    await contractDeployed.setMintingAllowed(true);
    await contractDeployed.setTransferAllowed(true);
    await contractDeployed.mint();
    console.log(await contractDeployed.tokensOwnedBy(await contractDeployed.owner()))
    await contractDeployed.transferToken(await contractDeployed.owner(), ANY, 1);
    console.log(await contractDeployed.getTotalMints())
    console.log(await contractDeployed.getOwnerOfToken(1))
    console.log(await contractDeployed.tokenURI(1))
    await contractDeployed.burn(1);
    await contractDeployed.mint();
    await contractDeployed.mint();
    await contractDeployed.TOTAL_MINTS;
    await contractDeployed.burn(3);

    console.log(await contractDeployed.balanceOf(contractDeployed.owner()))
  });
});


