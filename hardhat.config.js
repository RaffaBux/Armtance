/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require('ethereum-waffle');
require('chai');
require('ethers');
require('solidity-coverage');

module.exports = {
  solidity: "0.8.18",
  paths: {
    sources: "./src/contracts",
    tests: "./src/tests",
    cache: "./cache",
    artifacts: "./artifacts"
  }
};
