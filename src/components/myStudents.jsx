import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card } from 'react-bootstrap';

export default function MyStudents(props){

    const [user, setUser] = useState(props.user);
    const [myStudents, setMyStudents] = useState(null);

    useEffect(() => {
        getMyStudents();
    }, []);

    async function getMyStudents(){
        try{
            let response = await axios.get(`https://localhost:44394/api/users/my_students`, {headers: {Authorization: 'Bearer ' + user.token}});
            setMyStudents(response.data);
        }
        catch(err){
            alert('Error getting students.\n' + err)
        }
    }

    async function getLessonsByRelationshipId(id){

    }

    function generateStudentCard(student){
        return(
            <Card>
                {student.student.firstName}
            </Card>
        )
    }

    function generateStudentDisplay(){
        let cardDisplay = [];

        for (let i=0; i<myStudents.length; i = i+3){
            cardDisplay.push(
                <div className='row mt-4'>
                    {myStudents[i] ?
                        <div className='col'>
                            {generateStudentCard(myStudents[i])}
                        </div>
                        :
                        <div className='col' />
                    }
                    {myStudents[i+1] ?
                        <div className='col'>
                            {generateStudentCard(myStudents[i+1])}
                        </div>
                        :
                        <div className='col' />
                    }
                    {myStudents[i+2] ?
                        <div className='col'>
                            {generateStudentCard(myStudents[i+2])}
                        </div>
                        :
                        <div className='col' />
                    }
                </div>
            )
        }

        return(
            <React.Fragment>
                {cardDisplay}
            </React.Fragment>
        )
    }

    return(
        <React.Fragment>
            <h1 className='text-center'>List of students goes here. Include links to lesson records and documents.</h1>
            {myStudents ? 
            generateStudentDisplay()
            :
            <p className='text-center'>Loading students...</p>
            }
        </React.Fragment>
    )
}