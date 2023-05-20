import './address.css';
import React, { useState } from 'react';
import { RiDeleteBin2Fill } from 'react-icons/ri';
import AddressStruct from '../../assets/addressStruct.json';

export default function Address(props) {

  const [addressData, updateAddressData] = useState(setDefaultData());

  function setDefaultData() {
    var defaultAddressData = {...AddressStruct};
    defaultAddressData.addressId = props.index;
    return defaultAddressData;
  }

  function handleChange() {
    var newAddressData = addressData;
    newAddressData.address = '0x'.concat(document.getElementsByClassName('heir')[props.parentIndex]
        .getElementsByClassName('address')[props.index].value);
    
    newAddressData.amount = document.getElementsByClassName('heir')[props.parentIndex]
      .getElementsByClassName('amount')[props.index].value;

    props.update(newAddressData);
    updateAddressData(newAddressData);
  }

  function removeAddress() {
    props.remove(props.index);
  }
  
  return(
    <div className='centredRowContainer'>
      <div className='contentPadding' onClick={removeAddress}>
        <RiDeleteBin2Fill/>
      </div>
      <hr/>
      {
        props.index
      }
      <h5 className='contentMargin'>address:</h5>
      <h5 className='heirText'>0x</h5>
      <input className='address largeDataInput' maxLength={40} onChange={handleChange}/>
      <hr/>
      <input className='amount smallDataInput' onChange={handleChange}/>
      <h5 className='contentMargin'>ETH</h5>
    </div>
  );
}
