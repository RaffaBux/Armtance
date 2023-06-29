import './split.css';
import React from 'react';

export default function Split(props) {
  
  function splitHandler() {
    var vc = document.getElementById('vcInput').files[0];

    var reader = new FileReader();
    reader.onload = function() {
      var vcContent = JSON.parse(reader.result);
      
      // TODO: controlli se il file è json etc
      props.split(vcContent);
    };

    reader.readAsText(vc);
  }

  return(
    <div className='split'>
      <div className='centredRowContainer announcement'>
        <h3> Pagina dell'erede identificato come {props.current.did} </h3>
      </div>
      <hr/>
      <div className='centredRowContainer'>
        <div>
          <div className='buttonContainer'>
            <input type='file' id='vcInput' className='buttonText'/>
          </div>
        </div>
        <div>
          <div className='buttonContainer' onClick={ () => { splitHandler() }}>
            <h5 className='buttonText'>SMISTA EREDITA'</h5>
          </div>
        </div>
      </div>
    </div>
  );
}