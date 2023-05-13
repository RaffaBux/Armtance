import React from 'react';
import './inheritance.css';
import { Link } from 'react-router-dom';

export default function Inheritance() {
  
  return(
    <div className='inheritance'>
      <Link id='confirmButtonContainer' to={'/settings'}>
        <h5 id='confirmText'>IMPOSTA EREDI</h5>
      </Link>
      <Link to={'/split'} id='confirmButtonContainer'>
        <h5 id='confirmText'>RECLAMA EREDITA'</h5>
      </Link>
    </div>
  );
}
