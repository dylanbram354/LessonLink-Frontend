import React, { useState, useEffect } from 'react';
import useForm from '../hooks/useForm';
import { Form, Button, Card, Container } from 'react-bootstrap';

export default function CreateLessonForm(props){

    const { values, handleChange, handleSubmit } = useForm(submitForm);
    const [today, setToday] = useState(() => { let date = new Date().toISOString(); return date.substring(0, date.length-7) + '00.00'});

    useEffect(() => {console.log(today)}, [])

    async function submitForm(){
        console.log(values);
        return
    }

    return(
        <React.Fragment>
            <div className='text-center row'>
                <div className='col' />
                <div className='col'>
                    <h1>Schedule lesson</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className='mt-2' controlId='startTime'>
                            <Form.Label>Start time</Form.Label>
                            <Form.Control type='datetime-local' name='startTime' onChange={handleChange} value={values.startTime} min={today} required={true}/>
                        </Form.Group>
                        <Form.Group className='mt-2' controlId='endTime'>
                            <Form.Label>End time</Form.Label>
                            <Form.Control type='datetime-local' name='endTime' onChange={handleChange} value={values.endTime} min={values.startTime} required={true}/>
                        </Form.Group>
                        <Button className='mt-2' type="submit">Submit</Button>
                    </Form>
                </div>
                <div className='col' />
            </div>
        </React.Fragment>
    )
}