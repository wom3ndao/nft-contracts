const ANY = "0x4a7D0d9D2EE22BB6EfE1847CfF07Da4C5F2e3f22";
describe("Wom3nNFT", async function () {
  let nftContractFactory;
  let contractDeployed;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async () => {
    [addr1, addr2, addr3] = await ethers.getSigners();
    nftContractFactory = await hre.ethers.getContractFactory('Wom3nNFT');
    contractDeployed = await nftContractFactory.deploy();
    await contractDeployed.deployed(); // Waits for the contract to be deployed successfully
  });
  it("should deploy and execute functions", async () => {
    const owner = await contractDeployed.owner();
    await contractDeployed.addToAllowlist([owner])
    await contractDeployed.setMintingAllowed(true);
    await contractDeployed.setTransferAllowed(true);
    await contractDeployed.mint();
    expect((await contractDeployed.tokensOwnedBy(contractDeployed.owner())).toString()).to.equal("1");
    await contractDeployed.transferToken(await contractDeployed.owner(), ANY, 1);
    expect((await contractDeployed.getTotalMints()).toString()).to.equal("1");
    expect((await contractDeployed.getOwnerOfToken(1)).toString()).to.equal(ANY);
    console.log(await contractDeployed.tokenURI(1))
    await contractDeployed.mint();
    await contractDeployed.mint();
    expect((await contractDeployed.getTotalMints()).toString()).to.equal("3");
    await contractDeployed.burn(3);
    expect((await contractDeployed.getTotalMints()).toString()).to.equal("3"); // burning does not reduce total mints
    expect((await contractDeployed.balanceOf(contractDeployed.owner())).toString()).to.equal("1"); // minted 3, burned 1, transferred 1
    expect((await contractDeployed.allowlist(contractDeployed.owner())).toString()).to.equal("true");
    await contractDeployed.transferToken(await ANY, "0xE884cc98a142a05544e24ABb7a9B4BCaF4e5D28a", 1);

  });
  it("should fail when any address tries to burn another token", async () => {
    try {
      console.log("owner: ", await contractDeployed.owner());
      await contractDeployed.addToAllowlist([addr1.address, addr2.address]);
      await contractDeployed.connect(addr2).mint();
      await contractDeployed.connect(addr1).mint();
      await contractDeployed.connect(addr2).burn(2);
      assert.fail("The transaction should have failed but did not.");
    } catch (error) {
      console.error(error);
    }
  });
  it("should fail when any address tries to transfer", async () => {
    try {
      console.log("owner: ", await contractDeployed.owner());
      await contractDeployed.addToAllowlist([addr1.address, addr2.address]);
      await contractDeployed.connect(addr2).mint();
      await contractDeployed.setTransferAllowed(true);
      await contractDeployed.connect(addr1).transferToken(addr2.address, await contractDeployed.vaultAddress(), 1) // owner is allowed
      // await contractDeployed.connect(addr1).transferToken(addr2.address, await contractDeployed.vaultAddress(), 1) // now token owner is vault and fails
      await contractDeployed.connect(addr3).transferToken(await contractDeployed.vaultAddress(), addr2.address, 1) // address cannot trasnfer
      assert.fail("The transaction should have failed but did not.");
    } catch (error) {
      console.error(error);
    }
  });
  it("should not allow minting if mintingAllowed is false", async () => {
    try {
      await contractDeployed.addToAllowlist([addr1.address, addr2.address]);
      await contractDeployed.setMintingAllowed(false);
      await contractDeployed.connect(addr2).mint();
      assert.fail("The transaction should have failed but did not.");
    } catch (error) {
      console.error(error);
    }
  });
  it("Should prevent minting if not in allowlist", async function () {
    await contractDeployed.addToAllowlist([addr1.address, addr2.address]);
    await contractDeployed.removeFromAllowlist([addr2.address]);
    await expect(contractDeployed.connect(addr2).mint()).to.be.revertedWith("Wom3nNFT: sender not in the allowlist");
  });

  it("Should set the right devAddress", async () => {
    await contractDeployed.setDevAddress(addr3.address);
    expect(await contractDeployed.devAddress()).to.equal(addr3.address);
  });

  it("Should set the right vaultAddress", async () => {
    const vault = "0xE884cc98a142a05544e24ABb7a9B4BCaF4e5D28a"
    await contractDeployed.setVaultAddress(vault);
    expect(await contractDeployed.vaultAddress()).to.equal(vault);
  });

  it("should not allow minting more than 50 items", async function () {
    // Assume addToAllowlist function to allow the owner to mint
    await contractDeployed.addToAllowlist([await contractDeployed.owner()]);

    // Mint 50 items
    for (let i = 0; i < 50; i++) {
      await contractDeployed.mint();
    }

    // Attempt to mint the 51st item
    await expect(contractDeployed.mint()).to.be.revertedWith(
      "Wom3nNFT: All NFTs are minted!"
    );
  });

  it("Should set the correct base URL", async function () {
    const newBaseURL = "https://newbaseurl.com/";

    // We call the function with the new base URL
    await contractDeployed.updateBaseUrl(newBaseURL);

    // We get the base URL of the contract
    const contractBaseURL = await contractDeployed.baseUrl();

    // We check if the contract's base URL is the same as the new one
    expect(contractBaseURL).to.equal(newBaseURL);
  });
});


