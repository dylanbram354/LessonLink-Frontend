import React, { useState, useEffect} from 'react';

export default function LandingPage(props){

    const [user, setUser] = useState(null);

    useEffect(() => {setUser(props.user)}, [props.user]);

    return(
        <React.Fragment>
          {user ?
            <React.Fragment>
                {user.role === "Teacher" ?
                    <React.Fragment>
                    <div className='text-center'>
                        <p>Teacher logged in</p>
                    </div>
                    </React.Fragment>
                :
                    <React.Fragment>
                    <div className='text-center'>
                        <p>Student logged in</p>
                    </div>
                    </React.Fragment>
                } 
            </React.Fragment>
            :
            <div className='text-center'>
                <p>Logged out</p>
            </div>
            }
        </React.Fragment>
    )
}