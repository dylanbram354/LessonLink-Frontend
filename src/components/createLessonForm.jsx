import React, { useState, useEffect } from 'react';
import useForm from '../helpers/useForm';
import axios from 'axios';
import { Form, Button, Row, Col, InputGroup } from 'react-bootstrap';
import moment from 'moment';
import useCal from '../helpers/useCal';
import { Redirect } from 'react-router';

export default function CreateLessonForm(props){

    const { values, handleChange, handleSubmit, setValues } = useForm(submitForm);
    const { addEvent } = useCal();
    const [user, setUser] = useState(props.user);
    const [myStudents, setMyStudents] = useState(null);
    const [today, setToday] = useState(() => { let date = moment().format(); return date.substring(0, date.length-9) + ':00.00'});
    const [redirect, setRedirect] = useState(false);
    const [recurring, setRecurring] = useState(false);

    useEffect(() => {
        setValues({...values, addToGoogle: false});
        getMyStudents();
    }, [])

    async function getMyStudents(){
        try{
            let response = await axios.get('https://localhost:44394/api/users/my_students', {headers: {Authorization: 'Bearer ' + user.token}});
            setMyStudents(response.data);
        }
        catch(err){
            alert(err)
        }
    }

    function createOffset(date) {
        function pad(value) {
            return value < 10 ? '0' + value : value;
        };
        var sign = (date.getTimezoneOffset() > 0) ? "-" : "+";
        var offset = Math.abs(date.getTimezoneOffset());
        var hours = pad(Math.floor(offset / 60));
        var minutes = pad(offset % 60);
        return sign + hours + ":" + minutes;
    }

    async function createGoogleEvent(){
        let offset = createOffset(new Date());
        let student = myStudents.filter(stu => {return stu.student.id === values.studentId});
        student = student[0].student;
        try{
            let startObject = {
                'dateTime':`${values.startTime}:00${offset}`
            };
            let endObject = {
                'dateTime':`${values.endTime}:00${offset}`
            };
            let summaryString = `Lesson with ${student.firstName} ${student.lastName}`;
            await addEvent( startObject, endObject, summaryString, addLesson);
        }
        catch(err){
            alert(err)
        }
    }

    async function addLesson(eventId = null){
        let location = values.location;
        let comments = values.comments;
        if (typeof values.location == 'undefined'){
            location = null;
        }
        if (typeof values.comments == 'undefined'){
            comments = null;
        }
        let newLesson = {
            startTime: values.startTime,
            endTime: values.endTime,
            googleEventId: eventId,
            location: location,
            comments: comments,
            feeAmount: parseFloat(values.feeAmount)
        };
        console.log(newLesson);
        try{
            let response = await axios.post(`https://localhost:44394/api/lessons/create/studentId=${values.studentId}`, newLesson, {headers: {Authorization: 'Bearer ' + user.token}});
            setRedirect(true);
        }
        catch(err){
            alert(err);
        }
    }

    function addWeeks(originalTime, numWeeksToAdd){
        if(numWeeksToAdd ==0){
            return originalTime;
        }
        else{
            let newTime = new Date(originalTime);
            newTime.setDate(newTime.getDate() + (7*numWeeksToAdd));
            newTime.setHours(newTime.getHours() - 4);
            newTime = newTime.toISOString();
            newTime = newTime.substring(0, newTime.length-8);
            return newTime;
        }
    }

    async function addWeeklyLessons(){
        let location = values.location;
        let comments = values.comments;
        if (typeof values.location == 'undefined'){
            location = null;
        }
        if (typeof values.comments == 'undefined'){
            comments = null;
        }
        console.log(values.startTime);
        let responses = [];
        let promises = [];
        for (let i=0; i<values.repeat; i++){
            let startTime = addWeeks(values.startTime, i);
            let endTime = addWeeks(values.endTime, i);
            let newLesson = {
                startTime: startTime,
                endTime: endTime,
                googleEventId: null,
                location: location,
                comments: comments,
                feeAmount: parseFloat(values.feeAmount)
            };
            try{
                promises.push(
                    axios.post(`https://localhost:44394/api/lessons/create/studentId=${values.studentId}`, newLesson, {headers: {Authorization: 'Bearer ' + user.token}})
                    .then(response => {responses.push(response.data);}));
            }
            catch(err){
                alert(err);
            }
        }
        Promise.all(promises).then(()=>console.log(responses));
        setRedirect(true);
    }

    async function submitForm(){ 
        if(recurring){
            addWeeklyLessons();
        }
        else if (values.addToGoogle == true){
            await createGoogleEvent();
        }
        else{
            await addLesson();
            setRedirect(true);
        }
    }

    function handleToggle(){
        setValues({...values, addToGoogle: !values.addToGoogle});
    }

    return(
        <React.Fragment>
            {!redirect ? 
            <div className='text-center row'>
                <div className='col' />
                <div className='col'>
                    <h1>New Lesson</h1>
                    <Form onSubmit={handleSubmit}>
                        {myStudents ? 
                            <Form.Group className='mt-2' controlId="studentId">
                                <Form.Label>Select student</Form.Label>
                                <Form.Select name="studentId" onChange={handleChange} value={values.studentId} required={true}>
                                    <option key='1' value=''>Select a student</option>
                                    {myStudents.map(student => {return <option key ={student.student.id} value={`${student.student.id}`}>{student.student.firstName} {student.student.lastName}</option>})}
                                </Form.Select>
                            </Form.Group>
                        :
                            <p>Loading students...</p>
                        }
                        <Form.Group className='mt-2' controlId='startTime'>
                            <Form.Label>Start time</Form.Label>
                            <Form.Control type='datetime-local' name='startTime' onChange={handleChange} value={values.startTime} required={true}/>
                        </Form.Group>
                        <Form.Group className='mt-2' controlId='endTime'>
                            <Form.Label>End time</Form.Label>
                            <Form.Control type='datetime-local' name='endTime' onChange={handleChange} value={values.endTime} min={values.startTime} required={true}/>
                        </Form.Group>
                        {recurring && 
                        <Form.Group as={Row} className='mt-2' controlId='repeat'>
                            <Col/>
                            <Form.Label column >Repeat</Form.Label>
                            <Col>
                                <Form.Control type='number' max={12} min={2} name='repeat' onChange={handleChange} value={values.repeat} required={true}/>
                            </Col>
                            <Form.Label column>times</Form.Label>
                            <Col/>
                        </Form.Group>
                        }
                        <Button className='mt-2' variant='link' onClick={() => {setRecurring(!recurring)}}>{!recurring ? 'Make this a weekly event' : 'Cancel'}</Button>
                        <Form.Group className='mt-2' controlId='location'>
                            <Form.Label>Location (optional)</Form.Label>
                            <Form.Control as='textarea' rows={2} name='location' onChange={handleChange} value={values.location} required={false}/>
                        </Form.Group>
                        <Form.Group className='mt-2' controlId='comments'>
                            <Form.Label>Comments (optional)</Form.Label>
                            <Form.Control as='textarea' rows={3} name='comments' onChange={handleChange} value={values.comments} required={false}/>
                        </Form.Group>
                        <Form.Group className='mt-2' controlId='feeAmount'>
                            <Form.Label>Fee amount</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control type='number' min={0.00} step={0.01} name='feeAmount' onChange={handleChange} value={values.feeAmount} required={true} />
                            </InputGroup>
                        </Form.Group>
                        {!recurring &&
                        <Form.Group className='mt-2' controlId='addToGoogle'>
                            <Form.Check type='checkbox' label='Add to my Google Calendar' name='addToGoogle' onChange={handleToggle} value={values.addToGoogle} />
                        </Form.Group>
                        }
                        <Button className='mt-2' type="submit">Submit</Button>
                    </Form>
                </div>
                <div className='col' />
            </div>
            :
            <Redirect to='/' />
            }
            
        </React.Fragment>
    )
}