import './heir.css';
import { RiDeleteBin2Fill } from "react-icons/ri";

export default function Heir(props) {
  function removeHeir() {
    props.remove(props.key);
  }
  
  return(
    <div id='alignedContent' className='heir'>
      <div id='alignedContent'>
        <h5 id='contentMargin'>nome erede:</h5>
        <input className='eredityInput'/>
        <h5 className='receiveText'>riceve</h5>
        <input className='eredityInput'/>
        <h5 id='contentMargin'>ETH</h5>
      </div>
      <div id='contentPadding' className='leftBorderIcon' onClick={removeHeir}>
        <RiDeleteBin2Fill/>
      </div>
    </div>
  );
}
