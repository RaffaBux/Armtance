import './heir.css';
import { useState } from 'react';
import { Checkbox } from '@mui/material';
import Address from '../Address/Address';
import { RiDeleteBin2Fill, RiAddCircleFill } from 'react-icons/ri';

export default function Heir(props) {

  const [thisAddressId, setThisAddressId] = useState(1);
  const [delegated, setDelegation] = useState(false);
  const [addressCollection, updateAddressCollection] = useState([0]);

  const [heirStruct, updateHeirStruct] = useState({
    heirId: props.index,
    heirDid: 'did:didMethod:',
    delegation: delegated,
    addressData: [{
      addressId: 0,
      address: '0x',
      amount: 0
    }]
  });
  
  function removeHeir() {
    props.remove(props.index);
  }

  function addAddressHandler() {
    updateAddressCollection(prevAddresses => ([
      ...prevAddresses,
      thisAddressId
    ]));

    var newHeirStruct = heirStruct;
    newHeirStruct.addressData.push({
      addressId: thisAddressId,
      address: '0x',
      amount: 0
    });
    updateHeirStruct(newHeirStruct);

    setThisAddressId(thisAddressId + 1);
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
    updateHeirStruct(newHeirStruct);
  }

  function updateAddressData(packedData) {
    var newHeirStruct = heirStruct;

    for(let i = 0; i < newHeirStruct.addressData.length; i++) {
      if(newHeirStruct.addressData[i].addressId === packedData.addressId) {
        newHeirStruct.addressData[i] = packedData;
        break;
      }
    }

    updateHeirStruct(newHeirStruct);
  }

  function updateDelegation() {
    var newHeirStruct = heirStruct;
    newHeirStruct.delegation = !delegated;
    updateHeirStruct(newHeirStruct);

    setDelegation(!delegated);
  }

  function updateDid() {
    var newHeirStruct = heirStruct;
    newHeirStruct.heirDid = 'did:didMethod:'.concat(document.getElementsByClassName('heirDid')[0].value);

    console.log(newHeirStruct.heirDid);

    updateHeirStruct(newHeirStruct);
  }
  
  return(
    <div id='alignedContent' className='heir'>
      <div className='heirContent'>
        <div id='alignedContent'>
          <h5 id='contentMargin'>DID erede:</h5>
          <h5 id='precompiledWord'>did:</h5>
          <input id='eredityInput' className='heirDid' onChange={() => { updateDid() }}/>
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
