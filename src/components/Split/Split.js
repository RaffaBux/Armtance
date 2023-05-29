import './split.css';
import React from 'react';

export default function Split() {
  
  return(
    <div className='split'>
      <div className='centredRowContainer announcement'>
        <h3>
          ciao ₍´｡• ◡ •｡`₎ sono Gilberto, erede legittimo di Armando 
          ₍ ︶︿︶₎ e mi sono autenticato come il mio caro, ehm..., 
          z-zietto (??) ૮₍˶Ó﹏Ò ₎ა fornendo questa Verifiable Credential 
          TOTALMENTE autentica ₍づ◡﹏◡₎づ
        </h3>
      </div>
      <hr/>
      <div className='centredRowContainer'>
        <div>
            <div className='buttonContainer' onClick={ () => { alert('carica vc :3') }}>
              <h5 className='buttonText'>CARICA VERIFIABLE CREDENTIAL</h5>
            </div>
        </div>
        <div>
          <div className='buttonContainer' onClick={ () => { alert('controllo vc ed eventualmente smisto eredità') }}>
            <h5 className='buttonText'>SMISTA EREDITA'</h5>
          </div>
        </div>
      </div>
    </div>
  );
}