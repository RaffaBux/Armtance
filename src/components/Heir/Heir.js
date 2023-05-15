import './heir.css';
import React, { useState } from 'react';
import { Checkbox } from '@mui/material';
import Address from '../Address/Address';
import HeirStruct from '../../assets/heirStruct.json';
import AddressStruct from '../../assets/addressStruct.json';
import { RiDeleteBin2Fill, RiAddCircleFill } from 'react-icons/ri';

export default function Heir(props) {

  const [addressIdCounter, updateAddressIdCounter] = useState(1);
  const [delegated, setDelegation] = useState(false);
  const [addressCollection, updateAddressCollection] = useState([0]);

  const [heirStruct, updateHeirStruct] = useState(setDefaultStruct());

  function setDefaultStruct() {
    var defaultHeirStruct = {...HeirStruct};
    defaultHeirStruct.heirId = props.index;
    return defaultHeirStruct;
  }
  
  function removeHeir() {
    props.remove(props.index);
  }

  function addAddressHandler() {
    updateAddressCollection(prevAddresses => ([
      ...prevAddresses,
      addressIdCounter
    ]));

    var newHeirStruct = heirStruct;
    var newAddressStruct = {...AddressStruct};
    newAddressStruct.addressId = addressIdCounter;
    newHeirStruct.addressData.push(newAddressStruct);

    console.log(newHeirStruct.addressData);
    
    dataUpdateHandler(newHeirStruct);

    updateAddressIdCounter(addressIdCounter + 1);
  }
  
  function removeAddressHandler(toRemove) {
    if(addressCollection.length > 1) {
      updateAddressCollection(
        prevAddressesIds => prevAddressesIds.filter(
          addressID => addressID !== toRemove
        )
      );
    }

    var newHeirStruct = heirStruct;
    var newAddressArray = newHeirStruct.addressData.filter(
      address => address.addressId !== toRemove
    );
    newHeirStruct.addressData = newAddressArray;
    dataUpdateHandler(newHeirStruct);
  }

  function updateAddressData(newData) {
    var newHeirStruct = heirStruct;

    for(let i = 0; i < newHeirStruct.addressData.length; i++) {
      if(newHeirStruct.addressData[i].addressId === newData.addressId) {
        newHeirStruct.addressData[i] = newData;
        break;
      }
    }

    dataUpdateHandler(newHeirStruct);
  }

  function updateDelegation() {
    var newHeirStruct = heirStruct;
    newHeirStruct.delegation = !delegated;
    dataUpdateHandler(newHeirStruct);
    setDelegation(!delegated);
  }

  function updateDid() {
    var newHeirStruct = heirStruct;
    console.log(newHeirStruct.heirDid);
    newHeirStruct.heirDid = 'did:didMethod:'.concat(document.getElementById('heirDid').value);
    dataUpdateHandler(newHeirStruct);
  }

  function dataUpdateHandler(newHeirStruct) {
    props.update(newHeirStruct);
    updateHeirStruct(newHeirStruct);
  }
  
  return(
    <div id='alignedContent' className='heir'>
      <div className='heirContent'>
        <div id='alignedContent'>
          <h5 id='contentMargin'>DID erede:</h5>
          <h5 id='precompiledWord'>did:</h5>
          <input id='heirDid' className='eredityInput' onChange={() => { updateDid() }}/>
        </div>
        <br/>
        <div id='alignedContent'>
          <h5 id='contentMargin'>delegato ad identificarsi come me:</h5>
          <Checkbox checked={delegated} onChange={() => { updateDelegation() }}/>
        </div>
        <br/>
        <div>
          <div id='contentPadding' onClick={() => { addAddressHandler() }}>
            <RiAddCircleFill/>
          </div>
          <div>
          {
            addressCollection.map((addressId) => (
              <Address 
                key={addressId} 
                index={addressId}
                remove={removeAddressHandler}
                update={updateAddressData}
              />
            ))
          }
          </div>
        </div>
      </div>
      <div id='contentPadding' className='leftBorderIcon' onClick={ () => removeHeir() }>
        <RiDeleteBin2Fill/>
      </div>
    </div>
  );
}
