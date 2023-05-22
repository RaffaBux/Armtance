const Web3 = require('web3');

const Inheritance = require('../../artifacts/contracts/Inheritance/Inheritance.sol/Inheritance.json');

export async function initializeINH(INHAddress, ownerAddress) {
  
  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

  const inhContract = new web3.eth.Contract(Inheritance.abi, INHAddress);

  const inhContractInstance = await inhContract.deploy({
    data: Inheritance.bytecode,
    arguments: []
  }).send({
    from: ownerAddress, // ← msg.sender
    gas: 3000000,
    gasPrice: '30000000000000'
  });

  console.log(INHAddress);
  console.log('Inheritance contract deployed at:', inhContractInstance.options.address);

  return inhContract;
}