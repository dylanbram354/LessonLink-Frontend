import React, { useState, useEffect } from 'react';
import useForm from '../hooks/useForm';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Redirect, Link } from 'react-router';

export default function Register(props){

    const { values, handleChange, handleSubmit } = useForm(submitForm);
    const [redirect, setRedirect ] = useState(false);
    const [userType, setUserType] = useState(props.userType);

    async function submitForm(){
        let newUser = {...values, role: userType.toUpperCase()};
        console.log(newUser);
        try{
            let response = await axios.post('https://localhost:44394/api/authentication', newUser);
            setRedirect(true);
        }
        catch(err){
            alert(err);
        }        
    }

    return(
        <React.Fragment>
            {!redirect ?
            <div className='text-center'>
                {userType == "Teacher" 
                    ? 
                    <h1>Register Teacher</h1>
                    :
                    <h1>Register Student</h1>
                }
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="firstName">
                        <Form.Label>First name</Form.Label>
                        <Form.Control type="text" name="firstname" onChange={handleChange} value={values.firstName} required={true} />
                    </Form.Group>
                    <Form.Group controlId="lastName">
                        <Form.Label>Last name</Form.Label>
                        <Form.Control type="text" name="lastname" onChange={handleChange} value={values.lastName} required={true} />
                    </Form.Group>
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" onChange={handleChange} value={values.username} required={true} />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" onChange={handleChange} value={values.password} required={true} />
                        <Form.Text className="text-muted">
                        Must be at least 8 characters and contain a number, lowercase letter, and uppercase letter.
                        </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" name="email" onChange={handleChange} value={values.email} required={true} />
                    </Form.Group>
                    <Form.Group controlId="phonenumber">
                        <Form.Label>Phone number</Form.Label>
                        <Form.Control type="tel" name="phonenumber" onChange={handleChange} value={values.phonenumber} required={true} />
                    </Form.Group>
                    {userType === "Teacher" ? 
                        <Form.Group controlId="preferredContact">
                            <Form.Label>Preferred method of contact</Form.Label>
                            <Form.Select name="prefferedContact" onChange={handleChange} value={values.preferredContact} required={true}>
                                <option value="Email">Email</option>
                                <option value="Text">Text</option>
                                <option value="Phone">Phone</option>
                            </Form.Select>
                        </Form.Group>
                        :
                        <React.Fragment>
                            <Form.Group controlId="parentEmail">
                                <Form.Label>Parent/guardian email addrerss</Form.Label>
                                <Form.Control type="email" name="parentEmail" onChange={handleChange} value={values.parentEmail} required={true} />
                            </Form.Group>
                            <Form.Group controlId="parentPhone">
                                <Form.Label>Parent/guardian phone number</Form.Label>
                                <Form.Control type="tel" name="parentPhone" onChange={handleChange} value={values.parentPhone} required={true} />
                            </Form.Group>
                        </React.Fragment>
                        }
                </Form>
            </div>
            :
            <Redirect to="/login"/>
            }
        </React.Fragment>
    )
}