import './heir.css';
import React, { useState } from 'react';
import { Checkbox } from '@mui/material';
import Address from '../Address/Address';
import HeirStruct from '../../assets/heirStruct.json';
import AddressStruct from '../../assets/addressStruct.json';
import { RiDeleteBin2Fill, RiAddCircleFill } from 'react-icons/ri';

export default function Heir(props) {

  const [addressIdCounter, updateAddressIdCounter] = useState(1);
  const [addressCollection, updateAddressCollection] = useState([0]);

  const [heirStruct, updateHeirStruct] = useState(setDefaultStruct());

  const [delegated, setDelegation] = useState(false);

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

  function updateAddressHandler(newData) {
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

  function didUpdateHandler() {
    var newHeirStruct = heirStruct;
    newHeirStruct.heirDid = 'did:didMethod:'.concat(document.getElementsByClassName('heirDid')[props.index].value);
    dataUpdateHandler(newHeirStruct);
  }

  function dataUpdateHandler(newHeirStruct) {
    props.update(newHeirStruct);
    updateHeirStruct(newHeirStruct);
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
            addressCollection.map((addressId, addressIndex) => (
              <Address 
                key={addressId} 
                index={addressIndex}
                parentIndex={props.index}
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
