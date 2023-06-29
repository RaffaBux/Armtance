import Split from '../Split/Split';
import Settings from '../Settings/Settings';
import React, { useEffect, useState } from 'react';
import Inheritance from '../Inheritance/Inheritance';
import UserStruct from '../../assets/userStruct.json';
import AddressStruct from '../../assets/addressStruct.json';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

export default function Router() {

  const policyId = 0; //TEST

  const [accountList, updateAccountList] = useState({}); //TEST

  // current active user
  const [currentUser, setCurrentUser] = useState({});
  
  // inheritance owner user
  const [inheritanceOwner, updateInheritanceOwner] = useState([{}]);
  
  // all users list (owner + heirs)
  const [userList, updateUserList] = useState([{}]);

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
        accounts={accountList}
        save={saveUserList}
        confirm={confirmData}
      />
    },
    {
      path: '/split',
      element: <Split 
        split={verifyVC}
        current={currentUser}
      />
    }
  ]);

  // it is fired twice due React Strict Mode
  useEffect(() => {
    fetch('http://localhost:3015/getAccounts', {
      method: 'post'
    }).then(async (accountListString) => {
      var newAccountList = await accountListString.json();
      updateAccountList(newAccountList);
    });

    fetch('http://localhost:3015/getOwner', {
      method: 'post'
    }).then(async (ownerAccount) => {
      ownerAccount.json().then((ownerJSON) => {
        var ownerUser = accountToUser(ownerJSON, true);

        setCurrentUser(ownerUser);
        updateInheritanceOwner([ownerUser]);
        updateUserList([ownerUser]);
      });
    });

    // DEVELOPEMENT ONLY
    fetch('http://localhost:3015/getExampleVC', { method: 'post' });
  }, [])

  function accountToUser(account, ownership) {
    var newUser = {...UserStruct};

    newUser.did = account.did;
    newUser.owner = ownership;

    var newAddress = {...AddressStruct};
    newAddress.address = account.address;
    newUser.addressData = [newAddress];

    return newUser
  }

  function saveUserList(updatedHeirList) {
    var newUsersArray = inheritanceOwner.concat(updatedHeirList);
    updateUserList(newUsersArray);
  }

  function confirmData(updatedHeirList) {
    saveUserList(updatedHeirList);

    fetch('http://localhost:3015/isINHDeployed', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        policyIdentifier: policyId
      })
    }).then(async (results) => {
      var isDeployedJSON = await results.json();

      if(!isDeployedJSON.result) {
        await fetch('http://localhost:3015/deployINH', { method: 'post' });
      }

      saveHeirs(updatedHeirList);
    });
  }

  function saveHeirs(updatedHeirList) {
    fetch('http://localhost:3015/saveHeirs', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify({
        policyIdentifier: policyId,
        heirList: updatedHeirList,
        sender: currentUser
      })
    }).then((results) => {
      results.json().then((heirsSavingJSON) => {
        console.log(heirsSavingJSON);
      });
    });
  }

  function currentUserChangeHandler(did) {
    userList.forEach((user) => {
      if(user.did === did) { setCurrentUser(user); }
    });
  }

  // function updateContractHeirs(updatedHeirList) {} // TODO

  async function verifyVC(verifiableCredential) {
    fetch('http://localhost:3015/verifyVC', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-type': 'application/json'
      },
      body: JSON.stringify(verifiableCredential)
    }).then((results) => {
      results.json().then((resultsJSON) => {
        resultsJSON ? console.log('eredità smistata') : console.log('vc non autentica. eredità non smistata');
      })
    });
  }

  return(
    <RouterProvider router={router} />
  );
}