import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export default function LessonRecord(props){

    const [user, setUser] = useState(props.user);
    const [lesson, setLesson] = useState(null);
    const [redirectHome, setRedirectHome] = useState(false);

    useEffect(() => {
        if (typeof props.location == 'undefined'){
            setRedirectHome(true);
        }
        else{
            getLessonRecord();
        }
        
    })

    async function getLessonRecord(){
        try{
            let response = await axios.get(`https://localhost:44394/api/lessons/${props.location.state.lessonId}`, {headers: {Authorization: 'Bearer ' + user.token}});
            setLesson(response.data);
        }
        catch(err){
            alert('Error getting lesson record!\n' + err)
        }
    }

    
    function getTimeFromDateObject(d){
        let h = d.getHours();
        let m = d.getMinutes();
        if (m == 0){
            m ='00'
        }
        else if (0 < m && m < 10){
            m = '0'+`${m}`;
        }
        let amPm = 'AM';
        if (h > 12){
            h = h - 12;
            amPm = 'PM';
        }
        return (`${h}:${m} ${amPm}`)
    }

    function getDateFromDateObject(d){
        let day = d.getDate();
        let year = d.getFullYear();
        let month = d.getMonth()+1;
        return (`${month}/${day}/${year}`)
    }

    return(
        <React.Fragment>
            {redirectHome && <Redirect to='/' />}
            {lesson ? 
            <div className='row'>
                <div className='col' />
                <div className='col text-center'>
                    {new Date(lesson.endTime).getTime() > new Date().getTime() ? <h2>Scheduled Lesson</h2> : <h2>Lesson Record</h2>}
                    <h4>{lesson.relationship.teacher.firstName} {lesson.relationship.teacher.lastName} and {lesson.relationship.student.firstName} {lesson.relationship.student.lastName}</h4>
                    <p>{getDateFromDateObject(new Date(lesson.startTime))}, {getTimeFromDateObject(new Date(lesson.startTime))} - {getTimeFromDateObject(new Date(lesson.endTime))} </p>
                    {lesson.location && <p> {lesson.location}</p>}
                    <p><strong>Fee: </strong>${lesson.feeAmount}</p>
                    {lesson.comments && <p><strong>Teacher comments: </strong>{lesson.comments}</p>}
                    <p><strong>Attendance: </strong>{lesson.isNoShow ? 'Present' : 'NO-SHOW' }</p>
                    {new Date(lesson.endTime).getTime() < new Date().getTime() &&
                        <Button as={Link} to={{pathname: '/editLesson', state: { lesson: lesson }}}>Edit</Button>}
                </div>
                <div className='col' />
            </div>
            :
            <p className='text-center'>Loading..</p>
            }
            
        </React.Fragment>
    )
}