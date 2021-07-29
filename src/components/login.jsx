import React, { useState, useEffect } from 'react';
import useForm from '../helpers/useForm';
import axios from 'axios';
import { Button, Form } from 'react-bootstrap';
import { Redirect } from 'react-router';

export default function Login(props){

    const {values, handleChange, handleSubmit} = useForm(submitForm);
    const [redirect, setRedirect] = useState(false);

    async function submitForm(){
        let loggedInUser = {...values};
        try{
            let response = await axios.post('https://localhost:44394/api/authentication/login', loggedInUser);
            let token = response.data.token;
            localStorage.setItem('token', token);
            props.getToken();
            setRedirect(true);
        }
        catch(err){
            // if (typeof err.response.status !== 'undefined' && err.response.status === 401){
            //     alert('Invalid credentials!');
            // }
            // else{
                alert(err);
            // };
        }
    }
    return(
        <React.Fragment>
            {!redirect ? 
            <div className='row'>
                <div className='col' />
                <div className='col' >
                    <h1>Login</h1>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control type="text" name="username" onChange={handleChange} value={values.username} required={true} />
                        </Form.Group>
                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" name="password" onChange={handleChange} value={values.password} required={true} />
                        </Form.Group>
                        <Button className='mt-2' type="submit">Login</Button>
                    </Form>
                </div>
                <div className='col' />
            </div>
            :
            <Redirect to="/" />}
        </React.Fragment>
    )

}