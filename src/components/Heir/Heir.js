import './heir.css';
import { Checkbox } from '@mui/material';
import Address from '../Address/Address';
import React, { useEffect, useState } from 'react';
import UserStruct from '../../assets/userStruct.json';
import AddressStruct from '../../assets/addressStruct.json';
import { RiDeleteBin2Fill, RiAddCircleFill } from 'react-icons/ri';

export default function Heir(props) {

  const [addressIdCounter, updateAddressIdCounter] = useState(1);
  const [addressIdCollection, updateAddressIdCollection] = useState([0]);

  const [heirStruct, updateHeirStruct] = useState(setNewDefaultHeir(props.id));
  const [addressList, updateAddressList] = useState([setNewDefaultAddress(0)]);

  const [delegated, setDelegation] = useState(false);

  const [addressesTrigger, triggerUpdate] = useState(false);

  useEffect(() => {
    didUpdateHandler();
    triggerUpdate(!addressesTrigger);
  }, [props.trigger]);

  function setNewDefaultHeir(thisHeirId) {
    var newHeir = {...UserStruct};
    newHeir.id = thisHeirId;
    newHeir.addressData.push(setNewDefaultAddress(0));
    return newHeir;
  }

  function setNewDefaultAddress(thisAddressId) {
    var defaultAddressStruct = {...AddressStruct};
    defaultAddressStruct.id = thisAddressId;
    return defaultAddressStruct;
  }
  
  function removeHeir() {
    props.remove(props.id);
  }

  function addAddressHandler() {
    updateAddressIdCollection(prevAddressesIds => ([
      ...prevAddressesIds,
      addressIdCounter
    ]));

    var newAddressStruct = addressList;
    newAddressStruct.push(setNewDefaultAddress(addressIdCounter));

    var newHeirStruct = heirStruct;
    newHeirStruct.addressData = newAddressStruct;

    updateAddressList(newAddressStruct);
    heirStructUpdateHandler(newHeirStruct);

    updateAddressIdCounter(addressIdCounter + 1);
  }
  
  function removeAddressHandler(idToBeRemoved) {
    if(addressIdCollection.length > 1) {
      updateAddressIdCollection(prevAddressesIds => prevAddressesIds.filter(id => id !== idToBeRemoved));

      var newAddressList = addressList.filter(address => address.id !== idToBeRemoved);
      var newHeirStruct = heirStruct;

      newHeirStruct.addressData = newAddressList;

      updateAddressList(newAddressList);
      heirStructUpdateHandler(newHeirStruct);
    }
  }

  function updateAddressHandler(updatedAddress) {
    var newHeirStruct = heirStruct;
    var newAddressList = addressList;

    for(let i = 0; i < newAddressList.length; i++) {
      if(newAddressList[i].id === updatedAddress.id) {
        newAddressList[i] = updatedAddress;

        newHeirStruct.addressData = newAddressList;

        updateAddressList(newAddressList);
        heirStructUpdateHandler(newHeirStruct);
        break;
      }
    }
  }

  function updateDelegation() {
    var newHeirStruct = heirStruct;
    newHeirStruct.delegated = !delegated;

    setDelegation(!delegated);
    heirStructUpdateHandler(newHeirStruct);
  }

  function didUpdateHandler() {
    var newHeirStruct = heirStruct;

    newHeirStruct.did = 'did:'.concat(document.getElementsByClassName('heirDid')[props.index].value);
    heirStructUpdateHandler(newHeirStruct);
  }

  function heirStructUpdateHandler(updatedHeirStruct) {
    props.update(updatedHeirStruct);
    updateHeirStruct(updatedHeirStruct);
  }
  
  return(
    <div className='centredRowContainer heir'>
      <div className='heirContent'>
        <div className='centredRowContainer'>
          <h5 className='contentMargin'>DID erede:</h5>
          <h5 className='heirText'>did:</h5>
          <input className='heirDid largeDataInput' onChange={() => { didUpdateHandler() }}/>
        </div>
        <br/>
        <div className='centredRowContainer'>
          <h5 className='contentMargin'>delegato ad identificarsi come me:</h5>
          <Checkbox checked={delegated} onChange={() => { updateDelegation() }}/>
        </div>
        <br/>
        <div>
          <div className='contentPadding' onClick={() => { addAddressHandler() }}>
            <RiAddCircleFill/>
          </div>
          <div>
          {
            addressIdCollection.map((addressIdIterator, addressIndex) => (
              <Address 
                key={addressIndex} 
                index={addressIndex}
                parentIndex={props.index}
                id={addressIdIterator}
                trigger={addressesTrigger}
                remove={removeAddressHandler}
                update={updateAddressHandler}
              />
            ))
          }
          </div>
        </div>
      </div>
      <div className='contentPadding leftBorderIcon' onClick={ () => removeHeir() }>
        <RiDeleteBin2Fill/>
      </div>
    </div>
  );
}
