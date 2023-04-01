const { assert } = require("chai");
const truffleAssert = require("truffle-assertions");
const WomenNFT = artifacts.require("Wom3nNFT");

const OWNER = "0x4a7D0d9D2EE22BB6EfE1847CfF07Da4C5F2e3f22";
describe("Wom3nNFT", function () {
  it("should deploy and mint", async () => {
    const nftContractFactory = await hre.ethers.getContractFactory('Wom3nNFT');
    const contractDeployed = await nftContractFactory.deploy();
    const owner = await contractDeployed.owner();
    // await contractDeployed.addToAllowlist([owner])
    // await contractDeployed.setMintingAllowed(true);
    await contractDeployed.mint();
  });
  // describe("mint()", () => {
  //   beforeEach("setup", async () => {
  //     womenNFT = await WomenNFT.new();
  //     await womenNFT.addToAllowlist([OWNER])
  //   });

  //   it("should successfully mint", async () => {
  //     await womenNFT.setMintingAllowed(true);

  //     await womenNFT.mint();

  //     // assert.equal(await womenNFT.totalSupply(), "1");
  //     // assert.equal(await womenNFT.balanceOf(OWNER), "1");
  //     // assert.equal(await womenNFT.tokenOfOwnerByIndex(OWNER, "0"), "1");
  //   });

  //   // it("should not mint when minting is disabled", async () => {
  //   //   await womenNFT.setMintingAllowed(false);
  //   //   await truffleAssert.reverts(womenNFT.mint("http://testipfs.url"), "WomenNFT: minting is disabled");
  //   // });
  // })
});


