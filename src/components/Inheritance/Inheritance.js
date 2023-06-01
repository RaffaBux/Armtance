import './inheritance.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@mui/material';

export default function Inheritance(props) {

  const [currentUser, setCurrentUser] = useState(props.current);

  function updateCurrentUser(newCurrentUser) {
    setCurrentUser(newCurrentUser);

    props.currentUserChange(newCurrentUser.did);
  }

  return(
    <div className='inheritanceMainContainer'>
      <Link className='buttonContainer' to={'/settings'}>
      <h5 className='buttonText'>IMPOSTA EREDI</h5>
      </Link>
      <Link className='buttonContainer' to={'/split'}>
        <h5 className='buttonText'>RECLAMA EREDITA'</h5>
      </Link>
      <hr/>
      <div>
        {
          props.users.map((user, userIndex) => {
            if(user.did) {
              return(
                <div key={userIndex} className='centredRowContainer heir'>
                  <Checkbox
                    checked={currentUser.did === user.did}
                    onChange={ () => updateCurrentUser(user) }
                  />
                  <h5 className='heirDataField address'>
                    {user.did}
                  </h5>
                </div>
              )
            }
          })
        }
      </div>
    </div>
  );
}
