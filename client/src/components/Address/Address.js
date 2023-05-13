import './address.css';
import { RiDeleteBin2Fill } from 'react-icons/ri';

export default function Address(props) {

  function packData() {
    var packedData = {
      addressId: props.index,
      address: '0x'.concat(document.getElementsByClassName('address')[0].value),
      amount: document.getElementsByClassName('amount')[0].value
    }

    props.update(packedData);
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
      <input id='eredityInput' className='address' maxLength={40} onChange={packData}/>
      <hr/>
      <input id='smallEredityInput' className='amount' onChange={packData}/>
      <h5 id='contentMargin'>ETH</h5>
    </div>
  );
}
