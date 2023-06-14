import './settings.css';
import Heir from '../Heir/Heir';
import React, { useState } from 'react';
import { RiAddCircleFill } from 'react-icons/ri';
import UserStruct from '../../assets/userStruct.json';
import AddressStruct from '../../assets/addressStruct.json';

export default function Settings(props) {

  const [heirsIdCounter, updateHeirsIdCounter] = useState(1);
  const [heirsIdCollection, updateHeirsIdCollection] = useState([0]);

  const [heirList, updateHeirList] = useState([setNewDefaultHeir(0)]);

  const [heirsTrigger, triggerUpdate] = useState(false);

  function addHeirHandler() {    
    updateHeirsIdCollection((prevHeirsIds) => ([
      ...prevHeirsIds,
      heirsIdCounter
    ]));

    updateHeirList((prevHeirs) => ([
      ...prevHeirs,
      setNewDefaultHeir(heirsIdCounter)
    ]));

    updateHeirsIdCounter(heirsIdCounter + 1);
  }

  function setNewDefaultHeir(thisHeirId) {
    var newHeir = {...UserStruct};
    newHeir.id = thisHeirId;
    var newAddress = {...AddressStruct};
    newHeir.addressData.push(newAddress);
    return newHeir;
  }

  function removeHeirHandler(idToBeRemoved) {
    if(heirsIdCollection.length > 1) {
      updateHeirsIdCollection((prevHeirIds) => (prevHeirIds.filter((id) => (id !== idToBeRemoved ))));
      updateHeirList((prevHeirList) => (prevHeirList.filter((heir) => (heir.id !== idToBeRemoved ))));
    }   
  }

  function dataUpdateHandler(updatedHeir) {
    var newHeirList = heirList;

    for(let i = 0; i < newHeirList.length; i++) {
      if(newHeirList[i].id === updatedHeir.id) {
        newHeirList[i] = updatedHeir;
        break;
      }
    }

    updateHeirList(newHeirList);
  }

  // development only method
  function autoComplete() {
    var numberOfAddresses = document.getElementsByClassName('address').length;
    for(let i = 0; i < numberOfAddresses; i++) {
      document.getElementsByClassName('address')[i].value = (props.accounts[i].address).slice(2);
      document.getElementsByClassName('amount')[i].value = i + 1;
    }

    var j = 0;
    var heirs = document.getElementsByClassName('heir');
    for(let i = 0; i < heirs.length; i++) {
      var nextDid = 'did:ssi-cot-eth:31337:'.concat(props.accounts[i].address.slice(2));
      document.getElementsByClassName('heirDid')[i].value = nextDid.slice(4);
      var thisNumberOfAddresses = heirs[i].getElementsByClassName('address').length;
      j = j + thisNumberOfAddresses;
    }

    triggerUpdate(!heirsTrigger);
  }
 
  function saveData() {
    props.save(heirList);
  }

  function confirmData() {
    props.confirm(heirList);
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
        <div>
          <div className='buttonContainer' onClick={ () => { autoComplete() }}>
            <h5 className='buttonText'>AUTO-COMPLETA</h5>
          </div>
        </div>
        <div>
          <div className='buttonContainer' onClick={ () => { saveData() }}>
            <h5 className='buttonText'>SALVA</h5>
          </div>
        </div>
        <div>
          <div className='buttonContainer' onClick={ () => { confirmData() }}>
            <h5 className='buttonText'>CONFERMA</h5>
          </div>
        </div>
      </div>
      <div className='centredRowContainer'>
        <h4 className='contentMargin'>
          inserisci i DID degli eredi tra cui spartire l'eredit&agrave;, 
          i loro address e l'ammontare corrispondente:
        </h4>
        <div className='contentPadding' onClick={ () => { addHeirHandler() }}>
          <RiAddCircleFill/>
        </div>
      </div>
      <div>
        {
          heirsIdCollection.map((heirIdIterator, heirIndex) => (
            <Heir 
              key={heirIndex} 
              index={heirIndex}
              id={heirIdIterator}
              className='heir'
              trigger={heirsTrigger}
              update={dataUpdateHandler} 
              remove={removeHeirHandler}
            />
          ))
        }
      </div>
    </div>
  );
}
