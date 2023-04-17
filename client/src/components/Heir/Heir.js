import './heir.css';
import { RiDeleteBin2Fill } from "react-icons/ri";

function Heir() {
  return(
    <div id='alignedContent' className='heir'>
      <div id='alignedContent'>
        <h5 id='contentMargin'> nome erede: </h5>
        <input className='eredityInput'/>
        <h5 className='receiveText'> riceve </h5>
        <input className='eredityInput'/>
        <h5 id='contentMargin'> ETH </h5>
      </div>
      <div className='leftBorderIcon'>
        <RiDeleteBin2Fill id='contentMargin'/>
      </div>
    </div>
  );
}

export default Heir;