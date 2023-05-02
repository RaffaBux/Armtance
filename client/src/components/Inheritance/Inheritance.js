import './inheritance.css';
import { RiAddCircleFill } from 'react-icons/ri';
import { useState } from 'react';
import Heir from '../Heir/Heir'

var heirId = 1;

export default function Inheritance() {
  const [heirs, setHeir] = useState([<Heir key={0} index={0} remove={removeHeirHandler}/>]);
  
  function addHeirHandler() {
    setHeir([
      ...heirs,
      <Heir key={heirId} index={heirId} remove={removeHeirHandler}/>
    ]);
    heirId++;
  }

  function removeHeirHandler(toRemove) {
    if(heirs.length > 0) {
      setHeir(
        heirs.filter((heir) => heir.index !== toRemove)
      );
    }
  }
  
  return(
    <div className='inheritance'>
      <div id='alignedContent' className='announcement'>
        <h3>Armando è morto lasciando in eredità la modesta somma di</h3>
        <input className='eredityInput'/>
        <h3>ETH</h3>
      </div>
      <hr/>
      <div id='alignedContent' className='addHeir'>
        <h4 id='contentMargin'>Inserisci gli eredi tra cui spartire l'eredit&agrave; e il loro ammontare:</h4>
        <div id='contentPadding' onClick={() => { addHeirHandler(); }}>
          <RiAddCircleFill/>
        </div>
      </div>
      <div>
        {heirs}
      </div>
    </div>
  );
}
