import React, { useState, useEffect } from 'react';
import useForm from '../helpers/useForm';
import axios from 'axios';
import { Form, Button, Card, Container, InputGroup } from 'react-bootstrap';
import { Redirect } from 'react-router';

export default function LogPaymentForm(props){

    const { values, handleChange, handleSubmit, setValues } = useForm(submitForm);
    const [user, setUser] = useState(props.user);
    const [myStudents, setMyStudents] = useState(null);
    const [paymentMethods, setPaymentMethods] = useState(null);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        getPaymentMethods();
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

    async function getPaymentMethods(){
        try{
            let response = await axios.get('https://localhost:44394/api/payments/methods');
            setPaymentMethods(response.data);
        }
        catch(err){
            alert(err)
        }
    }

    async function submitForm(){
        let newPayment = {
            personId: values.studentId,
            methodId: parseInt(values.methodId),
            amount: parseFloat(values.amount)
        }
        try{
            let response = await axios.post('https://localhost:44394/api/payments', newPayment, {headers: {Authorization: 'Bearer ' + user.token}});
            setRedirect(true);
        }
        catch(err){
            alert(err);
        }
    }

    return(
        <React.Fragment>
            {!redirect ? 
                <div className='text-center row'>
                <div className='col' />
                <div className='col'>
                    <h1>Log Payment</h1>
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
                        {paymentMethods ? 
                            <Form.Group className='mt-2' controlId="methodId">
                                <Form.Label>Select payment method</Form.Label>
                                <Form.Select name="methodId" onChange={handleChange} value={values.methodId} required={true}>
                                    <option key='1' value=''>Payment method</option>
                                    {paymentMethods.map(method => {return <option key ={method.paymentMethodId} value={method.paymentMethodId}>{method.name}</option>})}
                                </Form.Select>
                            </Form.Group>
                        :
                            <p>Loading payment methods...</p>
                        }
                        <Form.Group className='mt-2' controlId='amount'>
                            <Form.Label>Amount</Form.Label>
                            <InputGroup>
                                <InputGroup.Text>$</InputGroup.Text>
                                <Form.Control type='number' min={0.00} step={0.01} name='amount' onChange={handleChange} value={values.amount} required={true} />
                            </InputGroup>
                        </Form.Group>
                        <Button className='mt-2' type="submit">Submit</Button>
                    </Form>
                </div>
                <div className='col' />
            </div>
            :
            <Redirect to='paymentRecords' />
            }
            
        </React.Fragment>
    )
}