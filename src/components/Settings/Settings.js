import './settings.css';
import Heir from '../Heir/Heir';
import React, { useState } from 'react';
import { RiAddCircleFill } from 'react-icons/ri';
import HeirStruct from '../../assets/heirStruct.json';

export default function Settings(props) {

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

  function autoComplete() {
    var numberOfAddresses = document.getElementsByClassName('address').length;
    for(let i = 0; i < numberOfAddresses; i++) {
      document.getElementsByClassName('address')[i].value = (props.addresses[i]).slice(2);
      document.getElementsByClassName('amount')[i].value = i + 1;
    }

    var j = 0;
    var heirs = document.getElementsByClassName('heir');
    for(let i = 0; i < heirs.length; i++) {
      document.getElementsByClassName('heirDid')[i].value = 'did:ssi-cot-eth:' + (i + 1) + ':' + props.addresses[j];
      var numberOfAddresses = heirs[i].getElementsByClassName('address').length;
      j = j + numberOfAddresses;
    }
  }
 
  return(
    <div className='settings'>
      <div className='centredRowContainer announcement'>
        <h3>
          ciao, sono Armando e prima di venir cullato dolcemente 
          tra le braccia candide dell'angelo della Morte decido 
          come spartire la mia eredit&agrave; tra quegli sfigati
          dei miei eredi
        </h3>
      </div>
      <hr/>
      <div className='centredRowContainer'>
        <h4 className='contentMargin'>
          inserisci i DID degli eredi tra cui spartire l'eredit&agrave;, 
          i loro address e l'ammontare corrispondente:
        </h4>
        <div className='contentPadding' onClick={() => { addHeirHandler() }}>
          <RiAddCircleFill/>
        </div>
        <div>
          <div className='buttonContainer' onClick={ () => { autoComplete() }}>
            <h5 className='buttonText'>AUTO-COMPLETA</h5>
          </div>
        </div>
        <div>
          <div className='buttonContainer' onClick={() => { console.log(heirList)}}>
            <h5 className='buttonText'>CONFERMA</h5>
          </div>
        </div>
      </div>
      <div>
        {
          heirsIdCollection.map((heirIdIterator, heirIndex) => (
            <Heir 
              key={heirIdIterator} 
              index={heirIndex}
              className='heir'
              update={dataUpdateHandler} 
              remove={removeHeirHandler}
            />
          ))
        }
      </div>
    </div>
  );
}
