import React, { useState, useEffect } from 'react';
import useForm from '../hooks/useForm';
import { Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { Redirect, Link } from 'react-router';

export default function Register(){

    const { values, handleChange, handleSubmit } = useForm(submitForm);
    const [redirect, setRedirect ] = useState(false);
    const [userType, setUserType] = useState(null);

    useEffect(() => {setUserType(values.userType)}, [values.userType]);

    async function submitForm(){
        let newUser = {...values, role: userType.toUpperCase()};
        newUser.userType = null;
        console.log(newUser);
        try{
            let response = await axios.post('https://localhost:44394/api/authentication', newUser);
            console.log(response.data);
            setRedirect(true);
        }
        catch(err){
            alert(err);
        }        
    }

    return(
        <React.Fragment>
            {!redirect ?
                <div className='row'>
                    <div className='col-3' />
                    <div className='text-center col'>
                        <Form onSubmit={handleSubmit}>
                            <Form.Group className='mt-2' controlId="userType">
                                <Form.Label>Are you a student or a teacher?</Form.Label>
                                <Form.Select name="userType" onChange={handleChange} value={values.userType} required={true}>
                                    <option value=''>Select an option</option>
                                    <option value="STUDENT">Student</option>
                                    <option value="TEACHER">Teacher</option>
                                </Form.Select>
                            </Form.Group>
                            
                            {userType && 
                                <React.Fragment>
                                    <Form.Group className='mt-2' controlId="firstName">
                                        <Form.Label>First name</Form.Label>
                                        <Form.Control type="text" placeholder="First name" name="firstname" onChange={handleChange} value={values.firstName} required={true} />
                                    </Form.Group>
                                    <Form.Group className='mt-2' controlId="lastName">
                                        <Form.Label>Last name</Form.Label>
                                        <Form.Control type="text" placeholder="Last name" name="lastname" onChange={handleChange} value={values.lastName} required={true} />
                                    </Form.Group>
                                    <Form.Group className='mt-2' controlId="username">
                                        <Form.Label>Username</Form.Label>
                                        <Form.Control type="text" name="username" placeholder="Username" onChange={handleChange} value={values.username} required={true} />
                                    </Form.Group>
                                    <Form.Group className='mt-2' controlId="password">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control type="password" name="password" placeholder="Password" pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" onChange={handleChange} value={values.password} required={true} />
                                        <Form.Text className="text-muted">
                                        Must be at least 8 characters and contain a number, lowercase letter, and uppercase letter.
                                        </Form.Text>
                                    </Form.Group>
                                    <Form.Group className='mt-2' controlId="email">
                                        <Form.Label>Email address</Form.Label>
                                        <Form.Control type="email" name="email" placeholder="Email address" onChange={handleChange} value={values.email} required={true} />
                                    </Form.Group>
                                    <Form.Group className='mt-2' controlId="phonenumber">
                                        <Form.Label>Phone number</Form.Label>
                                        <Form.Control type="tel" name="phonenumber" placeholder="Phone number" onChange={handleChange} value={values.phonenumber} required={true} />
                                    </Form.Group>
                                    <React.Fragment>
                                        {userType === "TEACHER" ? 
                                        <Form.Group className='mt-2' controlId="preferredContact">
                                            <Form.Label>Preferred method of contact</Form.Label>
                                            <Form.Select name="prefferedContact" onChange={handleChange} value={values.preferredContact} required={true}>
                                                <option value="Email">Email</option>
                                                <option value="Text">Text</option>
                                                <option value="Phone">Phone</option>
                                            </Form.Select>
                                        </Form.Group>
                                        :
                                        <React.Fragment>
                                            <Form.Group className='mt-2' controlId="parentEmail">
                                                <Form.Label>Parent/guardian email addrerss</Form.Label>
                                                <Form.Control type="email" name="parentEmail" placeholder="Parent/guardian email" onChange={handleChange} value={values.parentEmail} required={true} />
                                            </Form.Group>
                                            <Form.Group className='mt-2' controlId="parentPhone">
                                                <Form.Label>Parent/guardian phone number</Form.Label>
                                                <Form.Control type="tel" name="parentPhone" placeholder="Parent/guardian phone" onChange={handleChange} value={values.parentPhone} required={true} />
                                            </Form.Group>
                                        </React.Fragment>
                                        }
                                    </React.Fragment>
                                    <Button className='mt-2' type="submit">Register</Button>
                                </React.Fragment>
                            }
                        </Form>
                    </div>
                    <div className='col-3' />
                </div>
            :
                <Redirect to="/login"/>
            }
        </React.Fragment>
    )
}