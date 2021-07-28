import React, { useState, useEffect } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import useForm from '../hooks/useForm';
import { Redirect } from 'react-router-dom';
import axios from 'axios';

export default function EditLessonForm(props){

    const [user, setUser] = useState(props.user);
    const [lesson, setLesson] = useState(null);
    const [redirectHome, setRedirectHome] = useState(false);
    const [redirect, setRedirect] = useState(false);
    const { values, handleChange, handleSubmit, setValues } = useForm(submitForm);

    useEffect(() =>{
        if (typeof props.location == 'undefined'){
            setRedirectHome(true);
        }
        else{
            setValues({...values, feeAmount: props.location.state.lesson.feeAmount})
            setLesson(props.location.state.lesson);
        }
    }, [])

    async function putLesson(){
        let noShow = (values.isNoShow === "true");
        let newRecord = {
            feeAmount: parseFloat(values.feeAmount),
            comments: values.comments,
            isNoShow: noShow
        }
        try{
            let response = await axios.put(`https://localhost:44394/api/lessons/edit/${lesson.lessonId}`, newRecord, {headers: {Authorization: 'Bearer ' + user.token}});
        }
        catch(err){
            alert(`Error updating lesson!\n` + err)
        }
    }

    async function chargeFee(){
        let body = {
            studentId: lesson.relationship.studentId,
            balance: values.feeAmount
        }
        try{
            let response = await axios.put(`https://localhost:44394/api/relationships/update_balance`, body, {headers: {Authorization: 'Bearer ' + user.token}});
        }
        catch(err){
            alert('Error charging fee!\n' + err)
        }
    }

    async function submitForm(){
        if (values.charge == "true"){
            await chargeFee();
            await putLesson();
        }
        else{
            await putLesson();
        }
        setRedirect(true);
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
            {redirect && <Redirect to={{pathname: '/lessonRecord', state: { lessonId: lesson.lessonId }}} />}
            {lesson ? 
            <React.Fragment>
                <h1 className='text-center'>Log lesson with {lesson.relationship.student.firstName} {lesson.relationship.student.lastName}</h1>
                <h3 className='text-center'>{getDateFromDateObject(new Date(lesson.startTime))}</h3>
                <div className='row'>
                    <div className='col' />
                    <div className='col'>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mt-2' controlId='feeAmount'>
                                <Form.Label>Fee</Form.Label>
                                <InputGroup>
                                    <InputGroup.Text>$</InputGroup.Text>
                                    <Form.Control type='number' min={0.00} step={0.01} name='feeAmount' onChange={handleChange} value={values.feeAmount} required={true}/>
                                </InputGroup>
                            </Form.Group>
                            <Form.Group className='mt-2' controlId='comments'>
                                <Form.Label>Comments, links, or assignments for {lesson.relationship.student.firstName}:</Form.Label>
                                <Form.Control as='textarea' placeholder={lesson.comments} rows={3} name='comments' onChange={handleChange} value={values.comments}/>
                            </Form.Group>
                            <Form.Group className='mt-2' controlId="isNoShow">
                                <Form.Label>Did {lesson.relationship.student.firstName} attend the lesson?</Form.Label>
                                <Form.Select name="isNoShow" onChange={handleChange} value={values.isNowShow} required>
                                    <option key ='select1' value=''>Select an option</option>
                                    <option key='attended' value={false} >Yes</option>
                                    <option key='noShow' value={true} >No</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className='mt-2' controlId="charge">
                                <Form.Label>Would you like to charge the fee?</Form.Label>
                                <Form.Select name="charge" onChange={handleChange} value={values.charge} required>
                                    <option key ='select' value=''>Select an option</option>
                                    <option key='yes' value={true} >Yes - add ${values.feeAmount} to {lesson.relationship.student.firstName}'s balance.</option>
                                    <option key='no' value={false} >No - do not charge</option>
                                </Form.Select>
                            </Form.Group>
                            <Button className='mt-2' type="submit">Submit</Button>
                        </Form>
                    </div>
                    <div className='col' />
                </div>
            </React.Fragment>
            :
                <div className='text-center'>
                    <p>Loading...</p>
                </div>
            }
        </React.Fragment>
    )
}