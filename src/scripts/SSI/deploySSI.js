const Web3 = require('web3');

const SelfSovereignIdentity = require('../../artifacts/contracts/SSI/SelfSovereignIdentity.sol/SelfSovereignIdentity.json');

export async function initializeSSI() {
  
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

  const accounts = await web3.eth.getAccounts();

  // Deploy the SelfSovereignIdentity contract first
  const ssiContract = new web3.eth.Contract(SelfSovereignIdentity.abi, accounts[0]);

  // const accounts = await web3.eth.getAccounts();

  const ssiContractInstance = await ssiContract.deploy({
    data: SelfSovereignIdentity.bytecode,
    arguments: []
  }).send({
    from: accounts[0],
    gas: 3000000,
    gasPrice: '30000000000000'
  });

  // console.log(accounts[0]);
  // console.log('SelfSovereignIdentity deployed at:', ssiContractInstance.options.address);

  return ssiContract;
}
