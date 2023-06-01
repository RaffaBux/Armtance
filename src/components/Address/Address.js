import './address.css';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import React, { useEffect, useState } from 'react';
import AddressStruct from '../../assets/addressStruct.json';

export default function Address(props) {

  const [addressStruct, updateAddressStruct] = useState(setNewDefaultAddressStruct(props.id));

  useEffect(() => {
    updatesHandler();
  }, [props.trigger]);

  function setNewDefaultAddressStruct(thisAddressId) {
    var defaultAddressStruct = {...AddressStruct};
    defaultAddressStruct.id = thisAddressId;
    return defaultAddressStruct;
  }

  function updatesHandler() {
    var newAddressData = addressStruct;
    newAddressData.address = '0x'.concat(document.getElementsByClassName('heir')[props.parentIndex]
      .getElementsByClassName('address')[props.index].value);
    
    newAddressData.amount = document.getElementsByClassName('heir')[props.parentIndex]
      .getElementsByClassName('amount')[props.index].value;

    props.update(newAddressData);
    updateAddressStruct(newAddressData);
  }

  function removeAddress() {
    props.remove(props.id);
  }
  
  return(
    <div className='centredRowContainer'>
      <div className='contentPadding' onClick={removeAddress}>
        <RiDeleteBin2Fill/>
      </div>
      <hr/>
      <h5 className='contentMargin'>address:</h5>
      <h5 className='heirText'>0x</h5>
      <input className='address largeDataInput' maxLength={40} onChange={updatesHandler}/>
      <hr/>
      <input className='amount smallDataInput' onChange={updatesHandler}/>
      <h5 className='contentMargin'>ETH</h5>
    </div>
  );
}
