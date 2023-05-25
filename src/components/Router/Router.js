import Web3 from 'web3';
import Split from '../Split/Split';
import Settings from '../Settings/Settings';
import React, { useEffect, useState } from 'react';
import Inheritance from '../Inheritance/Inheritance';
import { initializeSSI } from '../../scripts/SSI/deploySSI';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { initializeINH } from '../../scripts/Inheritance/deployInheritance';

export default function Router() {

  // RESERVED
  // 0 -> SSI contract
  // 1 -> INH contract
  // 2 -> Inheritance owner
  const numberOfReservedAddresses = 3;
  const [reservedAddresses, setReservedAddresses] = useState();
  const [accountsAddresses, setAccountsAddresses] = useState();
  const [reservedDids, setReservedDids] = useState();
  const [accountsDids, setAccountsDids] = useState();

  const [SSIContractInstance, updateSSIContractInstance] = useState();

  const [INHContractDeployed, updateINHContractStatus] = useState(false);
  const [INHContractInstance, updateINHContractInstance] = useState();

  const [heirList, updateHeirList] = useState({});

  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Inheritance />,
      children: []
    },
    {
      path: '/settings',
      element: <Settings 
        addresses={accountsAddresses} 
        dids={accountsDids}
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
      deploySSI(addresses[0], addresses[1]);
      console.log('SSI addr: ' + addresses[0][0]);
      console.log('INH addr: ' + addresses[0][1]);
      console.log('Owner addr: ' + addresses[0][2]);
    });
  }, [])

  async function getAccountAddresses() {  //test
    const addresses = await web3.eth.getAccounts();
    
    var freeAddresses = addresses.slice(numberOfReservedAddresses);
    
    var lockedAddresses = [];
    for(let i = 0; i < numberOfReservedAddresses; i++) {
      lockedAddresses.push(addresses[i]);
    }

    setReservedAddresses(lockedAddresses);
    setAccountsAddresses(freeAddresses);

    return [lockedAddresses, freeAddresses];
  }

  async function deploySSI(lockedAddresses, freeAddresses) {
    initializeSSI(web3, lockedAddresses[0])
      .then((ssiContractInstance) => {
        var newReservedDids = [];
        for(let i = 0; i < lockedAddresses.length; i++) {
          ssiContractInstance.methods.addressToDid(lockedAddresses[i]).call().then(
            (did) => newReservedDids.push(did)
          );
        }

        var newAccountsDids = [];
        for(let i = 0; i < freeAddresses.length; i++) {
          ssiContractInstance.methods.addressToDid(freeAddresses[i]).call().then(
            (did) => newAccountsDids.push(did)
          );
        }

        setReservedDids(newReservedDids);
        setAccountsDids(newAccountsDids);
        updateSSIContractInstance(ssiContractInstance);
      });
  }

  function saveData(updatedHeirList) {
    updateHeirList(updatedHeirList);
  }

  function confirmData(updatedHeirList) {
    saveData(updatedHeirList);

    if(INHContractDeployed) {
      // updateContractHeirs(updatedHeirList);  //TODO
      setContractHeirs(INHContractInstance, updatedHeirList);
    } else {
      initializeINH(
        web3,
        reservedAddresses[1], 
        reservedAddresses[2], 
        updatedHeirList
      ).then((inhContractInstance) => {
        setContractHeirs(inhContractInstance, updatedHeirList);

        updateINHContractInstance(inhContractInstance);
      });

      updateINHContractStatus(!INHContractDeployed);
    }

    console.log('tt ok!');
  }

  async function setContractHeirs(inhContractInstance, newHeirList) {
    newHeirList.forEach((heir) => {
      inhContractInstance.methods.setHeir(
        heir.heirId,
        heir.heirDid,
        heir.delegation
      ).call({from: reservedAddresses[2]}).then((result) => { 
        result ? console.log('1: oke!') : console.log('1: mica oke :c ')
      });
    });

    newHeirList.forEach((heir) => {
      heir.addressData.forEach((account, index) => {
        inhContractInstance.methods.setHeirAddresses(
          index,
          heir.heirDid,
          account.addressId,
          account.address,
          account.amount
        ).call({from: reservedAddresses[2]}).then((result) => { 
            result ? console.log('2: oke!') : console.log('2: mica oke :c')
        });
      });
    });
  }

  // function updateContractHeirs(updatedHeirList) {} //TODO

  return(
    <RouterProvider router={router} />
  );
}