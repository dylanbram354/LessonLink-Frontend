import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Redirect, Link } from 'react-router-dom';
import { Button, Card } from 'react-bootstrap';
import useCal from '../helpers/useCal';

export default function LessonRecord(props){

    const [user, setUser] = useState(props.user);
    const [lesson, setLesson] = useState(null);
    const [redirectHome, setRedirectHome] = useState(false);
    const [redirectToSchedule, setRedirectToSchedule] = useState(false);
    const {addEvent, deleteEvent} = useCal();

    useEffect(() => {
        if (typeof props.location == 'undefined'){
            setRedirectHome(true);
        }
        else{
            getLessonRecord();
        }
        
    }, [])

    async function getLessonRecord(){
        try{
            let response = await axios.get(`https://localhost:44394/api/lessons/${props.location.state.lessonId}`, {headers: {Authorization: 'Bearer ' + user.token}});
            setLesson(response.data);
            console.log(response.data);
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

    async function cancelLesson(lesson){
        if (window.confirm("Are you sure? This will delete your record of this lesson along with any associated Google Calendar events.")){
            try{
                if(lesson.googleEventId != null){
                    await deleteEvent(lesson.googleEventId);
                }
                let response = await axios.delete(`https://localhost:44394/api/lessons/delete/${lesson.lessonId}`, { headers: {Authorization: "Bearer " + user.token}});
                setRedirectToSchedule(true);
            }
            catch(err){
                alert(err)
            }
        }
    }

    return(
        <React.Fragment>
            {redirectHome && <Redirect to='/' />}
            {redirectToSchedule && <Redirect to='/schedule' />}
            {lesson ? 
            <div className='row'>
                <div className='col' />
                <div className='col'>
                    <Card className='card-custom'>
                        <Card.Body className='text-center'>
                            <Card.Title className='mb-1'>{new Date(lesson.startTime).getTime() > new Date().getTime() ? <h2>Lesson Sheet (upcoming)</h2> : <h2>Lesson Sheet</h2>}</Card.Title>
                            <Card.Text>
                                <h4 className='mb-3'>{lesson.relationship.teacher.firstName} {lesson.relationship.teacher.lastName} and {lesson.relationship.student.firstName} {lesson.relationship.student.lastName}</h4>
                                <p>{getDateFromDateObject(new Date(lesson.startTime))}, {getTimeFromDateObject(new Date(lesson.startTime))} - {getTimeFromDateObject(new Date(lesson.endTime))} </p>
                                {lesson.location && <p> {lesson.location}</p>}
                                <p><strong>Fee: </strong>${lesson.feeAmount}</p>
                                {lesson.comments && <p><strong>Teacher comments: </strong>{lesson.comments}</p>}
                                {new Date(lesson.startTime).getTime() < new Date().getTime() &&
                                    <p><strong>Attendance: </strong>{!lesson.isNoShow ? 'Present' : 'NO-SHOW' }</p>}
                                {new Date(lesson.startTime).getTime() < new Date().getTime() && user.role=='Teacher' &&
                                    <Button as={Link} to={{pathname: '/editLesson', state: { lesson: lesson }}}>Edit</Button>}
                                {user.role === 'Teacher' && 
                                    <div className='mt-4'>
                                        <Button variant='danger' onClick={() => cancelLesson(lesson)}>Delete</Button>
                                    </div>
                                }
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
                <div className='col' />
            </div>
            :
            <p className='text-center'>Loading..</p>
            }
            
        </React.Fragment>
    )
}