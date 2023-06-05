import Web3 from 'web3';
import Split from '../Split/Split';
import Settings from '../Settings/Settings';
import React, { useEffect, useState } from 'react';
import Inheritance from '../Inheritance/Inheritance';
import UserStruct from '../../assets/userStruct.json';
import AddressStruct from '../../assets/addressStruct.json';
import AccountStruct from '../../assets/accountStruct.json';
import AccountListStruct from '../../assets/accountListStruct.json';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { deployINH } from '../../scripts/Inheritance/deployInheritance';
import { setDefaultChain } from '../../scripts/SelfSovereignIdentity/setDefaultChain';
import { deploySSI } from '../../scripts/SelfSovereignIdentity/deploySelfSovereignIdentity';

export default function Router() {

  const numberOfReservedAddresses = 6;
  const vcReleasersChainLength = 3;

  const ssiReservedAccountIndex = 0;
  const inhReservedAccountIndex = 1;
  const ownerReservedAccountIndex = 2;
  const vcReleaserReservedAccountIndex = 3

  // Reservation id -> 0 (SSI contract)
  // Reservation id -> 1 (INH contract)
  // Reservation id -> 2 (Inheritance owner)
  // Reservation id -> 3 (Verifiable Credential releaser)
  const [accountList, updateAccountList] = useState({...AccountListStruct});

  const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

  const [SSIContractInstance, updateSSIContractInstance] = useState({});

  const [INHContractDeployed, updateINHContractStatus] = useState(false);
  const [INHContractInstance, updateINHContractInstance] = useState({});

  // current active user
  const [currentUser, setCurrentUser] = useState({...UserStruct});
  // inheritance owner user
  const [inheritanceOwner, updateInheritanceOwner] = useState([{...UserStruct}]);
  // all users list (owner + heirs)
  const [userList, updateUserList] = useState([{...UserStruct}]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Inheritance 
        users={userList} 
        current={currentUser} 
        currentUserChange={currentUserChangeHandler}
      />
    },
    {
      path: '/settings',
      element: <Settings 
        accounts={accountList.free}
        save={saveData}
        confirm={confirmData}
      />
    },
    {
      path: '/split',
      element: <Split 
        split={verifyVC}
      />
    }
  ]);

  // it is fired twice due React Strict Mode
  useEffect(() => {
    getAccountAddresses().then((accountsStruct) => {
      codeStartUpHandler(accountsStruct);

      console.log('SSI addr: ' + accountsStruct.reserved[0].address);
      console.log('INH addr: ' + accountsStruct.reserved[1].address);
      console.log('Owner addr: ' + accountsStruct.reserved[2].address);
    });
  }, [])

  // development only function
  async function getAccountAddresses() {
    var newReservedAccounts = accountList.reserved;
    var newFreeAccounts = accountList.free;

    const nodeAccounts = await web3.eth.getAccounts();

    for(let i = 0; i < nodeAccounts.length; i++) {
      var thisAddress = nodeAccounts[i];
      
      // condition needed to counter useEffect development double shot
      if(
        newReservedAccounts.filter((account) => (account.address === thisAddress)).length < 1
        &&
        newFreeAccounts.filter((account) => (account.address === thisAddress)).length < 1
      ) {
        var newAccount = {...AccountStruct};
        newAccount.address = thisAddress;

        if(i < numberOfReservedAddresses) {
          if(i > vcReleaserReservedAccountIndex - 1) {
          newAccount.reservationId = vcReleaserReservedAccountIndex;
          } else {
            newAccount.reservationId = i;
          }
          
          newAccount.id = i;
          newReservedAccounts.push(newAccount);
        } else {
          newAccount.id = i - numberOfReservedAddresses;
          newFreeAccounts.push(newAccount);
        }
      }
    }

    var newAccountList = {...AccountListStruct};
    newAccountList.reserved = newReservedAccounts;
    newAccountList.free = newFreeAccounts; 

    updateAccountList(newAccountList);
    return newAccountList;
  }

  // development only function
  async function codeStartUpHandler(accountsStruct) {
    deploySSIHandler(accountsStruct);
  }

  // development only function
  async function deploySSIHandler(thisAccountList) {
    deploySSI(web3, thisAccountList.reserved[ssiReservedAccountIndex].address).then((ssiContractInstance) => {      
      ssiContractInstance.methods.addressToDid(thisAccountList.reserved[ownerReservedAccountIndex].address).call().then((ownerDid) => { 
        thisAccountList.reserved[ownerReservedAccountIndex].did = ownerDid;

        var newInheritanceOwner = {...UserStruct};
        newInheritanceOwner.did = ownerDid;
        newInheritanceOwner.owner = true;

        var newAddress = {...AddressStruct};
        newAddress.address = thisAccountList.reserved[ownerReservedAccountIndex].address;
        newInheritanceOwner.addressData.push(newAddress);
        
        saveData([]);
        setCurrentUser(newInheritanceOwner);
        updateInheritanceOwner([newInheritanceOwner]);
      });

      thisAccountList.reserved[ownerReservedAccountIndex].active = true;

      setDefaultChain(
        web3, 
        ssiContractInstance, 
        thisAccountList.reserved.filter((account) => (account.reservationId === vcReleaserReservedAccountIndex))
      ).then((chainAccounts) => {
        thisAccountList = setNewAccounts(thisAccountList, chainAccounts);
        updateAccountList(thisAccountList);
      });

      updateSSIContractInstance(ssiContractInstance);
    });
  }

  // development only function
  function setNewAccounts(thisAccountList, updatedAccounts) {  
    if(updatedAccounts.length > 0) {
      var accountsIndexIterator = 0;
      var newAccountList = thisAccountList;

      for(let i = 0; i < newAccountList.reserved.length && accountsIndexIterator < updatedAccounts.length; i++) {
        if(newAccountList.reserved[i].reservationId === updatedAccounts[accountsIndexIterator].reservationId) {
          newAccountList.reserved[i] = updatedAccounts[accountsIndexIterator++];
        }
      }

      return newAccountList;
    } else {
      return [];
    }
  }

  function currentUserChangeHandler(did) {
    userList.forEach((user) => {
      if(user.did === did) { setCurrentUser(user); }
    });
  }

  function saveData(updatedHeirList) {
    var newUsersArray = inheritanceOwner.concat(updatedHeirList);
    updateUserList(newUsersArray);
  }

  function confirmData(updatedHeirList) {
    saveData(updatedHeirList);

    if(INHContractDeployed) {
      // updateContractHeirs(updatedHeirList);  //TODO
      setHeirsIntoINHContract(INHContractInstance, updatedHeirList);
    } else {
      deployINH(
        web3,
        accountList.reserved[inhReservedAccountIndex].address, 
        accountList.reserved[ownerReservedAccountIndex].address, 
        updatedHeirList
      ).then((inhContractInstance) => {
        setHeirsIntoINHContract(inhContractInstance, updatedHeirList);
        updateINHContractInstance(inhContractInstance);
      });

      updateINHContractStatus(!INHContractDeployed);
    }

    console.log('tt ok!');
  }

  // TODO: aggiungere controlli
  // TODO: invocare createTrustedChild per ogni erede da settare (signature e private keys)
  async function setHeirsIntoINHContract(inhContractInstance, heirList) {
    heirList.forEach((heir) => {
      inhContractInstance.methods.setHeir(
        heir.id,
        heir.did,
        heir.delegated
      ).call({from: accountList.reserved[ownerReservedAccountIndex].address}).then((result) => { 
        result ? console.log('1: oke!') : console.log('1: mica oke :c ')
      });
    });

    heirList.forEach((heir) => {
      heir.addressData.forEach((account, index) => {
        inhContractInstance.methods.setHeirAddresses(
          index,
          heir.did,
          account.id,
          account.address,
          account.amount
        ).call({from: accountList.reserved[ownerReservedAccountIndex].address}).then((result) => { 
            result ? console.log('2: oke!') : console.log('2: mica oke :c')
        });
      });
    });
  }

  // function updateContractHeirs(updatedHeirList) {} //TODO

  async function verifyVC(verifiableCredential) {
    // non returna nullaaaaaaa
    const test = await SSIContractInstance.methods.resolveChain(accountList.reserved[5].did).call();
    console.log(test);

    console.log('ok siamo qua');
    console.log(verifiableCredential);
  }

  // function verifyDeath(credentialSubjectId) {
  //   if(credentialSubjectId === reservedDids[2]) 
  //     return true;
  //   else
  //     return false;
  // }

  return(
    <RouterProvider router={router} />
  );
}