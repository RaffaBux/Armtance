import './inheritance.css';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Checkbox } from '@mui/material';

export default function Inheritance(props) {

  const[currentUserDid, setCurrentUserDid] = useState(props.current.heirDid);

  useEffect(() => {
    console.log(props.current.heirDid)
  }, []);

  function updateUser(did) {
    setCurrentUserDid(did);

    props.userChange(did)
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
            if(user.heirDid) {
              return(
                <div key={userIndex} className='centredRowContainer heir'>
                  <Checkbox
                    checked={currentUserDid === user.heirDid}
                    onChange={ () => updateUser(user.heirDid) }
                  />
                  <h5 className='heirDataField address'>
                    {user.heirDid}
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
