const Web3 = require('web3');

const SelfSovereignIdentity = require('../../artifacts/contracts/SSI/SelfSovereignIdentity.sol/SelfSovereignIdentity.json');

async function main () {
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

  // Deploy the SelfSovereignIdentity contract first
  const ssiContract = new web3.eth.Contract(SelfSovereignIdentity.abi);
  const accounts = await web3.eth.getAccounts();
  const ssiContractInstance = await ssiContract.deploy({
    data: SelfSovereignIdentity.bytecode,
    arguments: []
  }).send({
    from: accounts[0],
    gas: 3000000,
    gasPrice: '30000000000000'
  });

  console.log('SelfSovereignIdentity deployed to:', ssiContractInstance.options.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
})
