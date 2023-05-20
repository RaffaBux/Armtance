import Web3 from 'web3';
import Split from '../Split/Split';
import Settings from '../Settings/Settings';
import React, { useEffect, useState } from 'react';
import Inheritance from '../Inheritance/Inheritance';
import { initializeSSI } from '../../scripts/SSI/deploySSI';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

export default function Router() {

  const [netAddresses, setNetAddresses] = useState([]);
  const [SSIAddress, setSSIAddress] = useState();
  // const [addressDids, updateAddressDids] = useState([]);
  const [SSIcontract, updateSSIContract] = useState();

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
      />
    },
    {
      path: '/split',
      element: <Split />
    }
  ]);

  useEffect(() => {  
    getAccountAddresses().then();
  }, [])

  async function getAccountAddresses() {  //test
    const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    const addresses = await web3.eth.getAccounts();

    setSSIAddress(addresses[0]);
    var accountsAddresses = addresses.slice(1);
    setNetAddresses(accountsAddresses);
  
    initializeSSI()
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

  return(
    <RouterProvider router={router} />
  );
}