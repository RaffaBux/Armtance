import Web3 from 'web3';
import Split from '../Split/Split';
import Settings from '../Settings/Settings';
import React, { useEffect, useState } from 'react';
import Inheritance from '../Inheritance/Inheritance';
import { initializeSSI } from '../../scripts/SSI/deploySSI';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { initializeINH } from '../../scripts/Inheritance/deployInheritance';

export default function Router() {

  const [netAddresses, setNetAddresses] = useState([]);
  const [SSIAddress, setSSIAddress] = useState();
  const [INHAddress, setINHAddress] = useState();
  const [ownerAddress, setOwnerAddress] = useState();

  // const [addressDids, updateAddressDids] = useState([]);

  const [SSIContract, updateSSIContract] = useState();

  const [INHContractDeployed, updateINHContractStatus] = useState(false);
  const [INHContract, updateINHContract] = useState();

  const [heirList, updateHeirList] = useState({});

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Inheritance />,
      children: []
    },
    {
      path: '/settings',
      element: <Settings 
        addresses={netAddresses} 
        // dids={addressDids}
        save={saveData}
        confirm={confirmData}
      />
    },
    {
      path: '/split',
      element: <Split />
    }
  ]);

  useEffect(() => {  
    getAccountAddresses().then((addresses) => {
      deploySSI(addresses[0]);
      console.log('SSI addr: ' + addresses[0]);
      console.log('INH addr: ' + addresses[1]);
      console.log('Owner addr: ' + addresses[2]);
    });
  }, [])

  async function deploySSI(ssiAddress) {
    initializeSSI(ssiAddress)
      .then(ssiContract => {
        // accountsAddresses.map(address => updateAddressDids([
        //   ...addressDids, 
        //   ssiContract.methods.addressToDid(address).send({
        //     from: addresses[0],
        //     gas: 3000000,
        //     gasPrice: '30000000000000'
        //   })
        // ]));

        updateSSIContract(ssiContract);
      });
  }

  function saveData(updatedHeirList) {
    updateHeirList(updatedHeirList);

    console.log(updatedHeirList);
  }

  function confirmData(updatedHeirList) {
    saveData(updatedHeirList);

    try {
      if(INHContractDeployed) {
        // INHContract.methods.stocazzo.call();
        console.log('INH risulta deployato');
      } else {
        initializeINH(INHAddress, ownerAddress).then(inhContract => {
          updateINHContract(inhContract);
        });
        updateINHContractStatus(!INHContractDeployed);
      }

      console.log('tt ok!');
    } catch(e) {
      console.log(e);
    }
  }

  async function getAccountAddresses() {  //test
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const addresses = await web3.eth.getAccounts();

    setSSIAddress(addresses[0]);
    setINHAddress(addresses[1]);
    setOwnerAddress(addresses[2]);
    setNetAddresses(addresses.slice(2));

    return [addresses[0], addresses[1], addresses[2]];
  }

  return(
    <RouterProvider router={router} />
  );
}