import './inheritance.css';
import { RiAddCircleFill } from 'react-icons/ri';
import { useState } from 'react';
import HeirList from '../HeirList/HeirList'
import Heir from '../Heir/Heir'

function Inheritance() {
  let heirId = 1;
  const [heirs, setHeir] = useState([<Heir key={0}/>]);
  function addHeirHandler() {
    setHeir([
      ...heirs,
      <Heir key={heirId++}/>
    ]);
  }
  
  return(
    <div className='inheritance'>
      <div id='alignedContent' className='announcement'>
        <h3>Armando è morto lasciando come eredità la modesta somma di</h3>
        <input className='eredityInput'/>
        <h3>ETH</h3>
      </div>
      <hr/>
      <div id='alignedContent' className='addHeir'>
        <h4 id='contentMargin'>Inserisci gli eredi tra cui spartire l'eredit&agrave; e il suo ammontare:</h4>
        <div id='contentPadding' onClick={() => { addHeirHandler(); }}>
          <RiAddCircleFill/>
        </div>
      </div>
      <div>
        <HeirList list={heirs}/>
      </div>
    </div>
  );
}

export default Inheritance;