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
    newAddressData.address = '0x'.concat(document.getElementById('address').value);
    newAddressData.amount = document.getElementById('amount').value;
    
    console.log(newAddressData.address);

    props.update(newAddressData);
    updateAddressData(newAddressData);
  }

  function removeAddress() {
    props.remove(props.index);
  }
  
  return(
    <div id='alignedContent'>
      <div id='contentPadding' onClick={removeAddress}>
        <RiDeleteBin2Fill/>
      </div>
      <hr/>
      <h5 id='contentMargin'>address:</h5>
      <h5 id='precompiledWord'>0x</h5>
      <input id='address' className='eredityInput' maxLength={40} onChange={handleChange}/>
      <hr/>
      <input id='amount' className='smallEredityInput' onChange={handleChange}/>
      <h5 id='contentMargin'>ETH</h5>
    </div>
  );
}
