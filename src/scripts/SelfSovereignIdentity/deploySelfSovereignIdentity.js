const SelfSovereignIdentity = require('../../artifacts/contracts/SSI/SelfSovereignIdentity.sol/SelfSovereignIdentity.json');

export async function deploySSI(web3, ssiAddress) {
  const ssiContract = new web3.eth.Contract(SelfSovereignIdentity.abi, ssiAddress);

  const ssiContractInstance = await ssiContract.deploy({
    data: SelfSovereignIdentity.bytecode,
    arguments: []
  }).send({
    from: ssiAddress,
    gas: 3000000,
    gasPrice: '30000000000000'
  });

  console.log('SSI param address: ', ssiAddress);
  console.log('SelfSovereignIdentity contract deployed at:', ssiContractInstance.options.address);

  return ssiContractInstance;
}
