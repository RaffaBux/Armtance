import './settings.css';
import Heir from '../Heir/Heir';
import React, { useState } from 'react';
import { RiAddCircleFill } from 'react-icons/ri';
import HeirStruct from '../../assets/heirStruct.json';

export default function Settings() {

  const [heirsIdCounter, updateHeirsIdCounter] = useState(1);
  const [heirsIdCollection, updateHeirsIdCollection] = useState([0]);

  const [heirList, updateHeirList] = useState([{...HeirStruct}]);

  function addHeirHandler() {    
    updateHeirsIdCollection(prevHeirIds => ([
      ...prevHeirIds,
      heirsIdCounter
    ]));

    updateHeirList(prevHeirs => ([
      ...prevHeirs,
      getNewDefaultHeir(heirsIdCounter)
    ]));

    updateHeirsIdCounter(heirsIdCounter + 1);
  }

  function getNewDefaultHeir(id) {
    var newHeir = {...HeirStruct};
    newHeir.heirId = id;
    return(newHeir);
  }

  function removeHeirHandler(toRemove) {
    if(heirsIdCollection.length > 1) {
      updateHeirsIdCollection(prevHeirIds => prevHeirIds.filter(id => id !== toRemove));
    }

    updateHeirList(prevHeirList => prevHeirList.filter(heir => heir.heirId !== toRemove));
  }

  function dataUpdateHandler(updatedData) {
    var newHeirList = heirList;

    for(let i = 0; i < newHeirList.length; i++) {
      if(newHeirList[i].heirId === updatedData.heirId) {
        newHeirList[i] = updatedData;
        break;
      }
    }

    updateHeirList(newHeirList);
  }
  
  return(
    <div className='settings'>
      <div id='alignedContent' className='announcement'>
        <h3>
          ciao, sono Armando e prima di venir cullato dolcemente 
          tra le braccia candide dell'angelo della Morte decido 
          come spartire la mia eredit&agrave; tra quegli sfigati
          dei miei eredi
        </h3>
      </div>
      <hr/>
      <div id='alignedContent' className='addHeir'>
        <h4 id='contentMargin'>
          inserisci i DID degli eredi tra cui spartire l'eredit&agrave;, 
          i loro address e l'ammontare corrispondente:
        </h4>
        <div id='contentPadding' onClick={() => { addHeirHandler() }}>
          <RiAddCircleFill/>
        </div>
        <div>
          <div id='confirmButtonContainer' onClick={() => { console.log(heirList)}}>
            <h5 id='confirmText'>CONFERMA</h5>
          </div>
        </div>
      </div>
      <div>
        {
          heirsIdCollection.map((heirIdIterator) => (
            <Heir 
              key={heirIdIterator} 
              index={heirIdIterator}
              update={dataUpdateHandler} 
              remove={removeHeirHandler}
            />
          ))
        }
      </div>
    </div>
  );
}
