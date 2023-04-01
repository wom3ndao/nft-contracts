require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-truffle5");
require("hardhat-contract-sizer");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("@nomiclabs/hardhat-waffle");

const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  networks: {
    q_mainnet: {
      url: "https://rpc.q.org",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasMultiplier: 1.2,
      timeout: 60000,
    },
    goerli: {
      url: "https://eth-goerli.public.blastapi.io",
      accounts: [process.env.PRIVATE_KEY],
    },
    q_testnet: {
      url: "https://rpc.qtestnet.org",
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
      gasMultiplier: 1.2,
      timeout: 60000,
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
