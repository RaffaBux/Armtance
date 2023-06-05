export async function setDefaultChain(web3, ssiInstance, chainAccounts) {  
  if (chainAccounts.length > 0) {
    var parentSignature = web3.eth.sign('VC releasers chain parent block signature!', chainAccounts[0].address);
    var parentDid = await ssiInstance.methods.createDid().call({from: chainAccounts[0].address});
    chainAccounts[0].did = parentDid;
    chainAccounts[0].active = true;

    for(let i = 1; i < chainAccounts.length; i++) {
      var childBlockDid = await ssiInstance.methods.createChildTrustedDid(chainAccounts[i].address, parentSignature).call({from: chainAccounts[i - 1].address});

      parentSignature = web3.eth.sign('VC releasers chain parent block signature!', chainAccounts[i].address);
      chainAccounts[i].did = childBlockDid;
      chainAccounts[i].active = true;
    }

    return chainAccounts;
  } else {
    return [];
  }
}