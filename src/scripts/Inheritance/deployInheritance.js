const Inheritance = require('../../artifacts/contracts/Inheritance/Inheritance.sol/Inheritance.json');

export async function deployINH(web3, inhAddress, ownerAddress) {
  const inhContract = new web3.eth.Contract(Inheritance.abi, inhAddress);

  const inhContractInstance = await inhContract.deploy({
    data: Inheritance.bytecode,
    arguments: []
  }).send({
    from: ownerAddress, // ← msg.sender
    gas: 3000000,
    gasPrice: '30000000000000'
  });

  console.log('INH param address: ', inhAddress);
  console.log('Inheritance contract deployed at:', inhContractInstance.options.address);

  return inhContractInstance;
}