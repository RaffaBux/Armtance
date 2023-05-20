import React from 'react';
import './inheritance.css';
import { Link } from 'react-router-dom';

export default function Inheritance() {
  return(
    <div className='inheritanceMainContainer'>
      <Link className='buttonContainer' to={'/settings'}>
        <h5 className='buttonText'>IMPOSTA EREDI</h5>
      </Link>
      <Link className='buttonContainer' to={'/split'}>
        <h5 className='buttonText'>RECLAMA EREDITA'</h5>
      </Link>
    </div>
  );
}
