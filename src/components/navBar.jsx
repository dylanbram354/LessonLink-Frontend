import React, { useState, useEffect } from 'react';
import { Navbar, Button, Container, Nav } from 'react-bootstrap';
import { Link, Redirect} from 'react-router-dom';

export default function NavBar(props){

    const [user, setUser] = useState(props.user);
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {setUser(props.user); setRedirect(false);}, [props.user])

    function logout(){
        setRedirect(true);
        props.logout();
    }

    return(
        <React.Fragment>
            {user ? 
                <React.Fragment>
                    {user.role == "Teacher" ? 
                        <Navbar variant="light">
                            <Container>
                                <Navbar.Brand>LessonLink</Navbar.Brand>
                                <Nav>
                                    <Nav.Item className="text-lg"> 
                                        <Nav.Link as={Link} to="/">Students</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link as={Link} to="schedule">Schedule</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link as={Link} to="paymentRecords">Payments</Nav.Link>
                                    </Nav.Item>
                                    {/* <Nav.Item>
                                        <Nav.Link as={Link} to="createLesson">Add Lesson</Nav.Link>
                                    </Nav.Item> */}
                                    <Nav.Item>
                                        {!redirect ? <Button variant='danger' onClick={() => logout()} >Logout {user.username}</Button> : <Redirect to='/'/>}
                                    </Nav.Item>
                                </Nav>
                            </Container>
                        </Navbar>
                    :
                    <Navbar variant="light">
                        <Container>
                            <Navbar.Brand>LessonLink</Navbar.Brand>
                            <Nav>
                                <Nav.Item className="text-lg"> 
                                    <Nav.Link as={Link} to="/">Teachers</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link as={Link} to="schedule">Schedule</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link as={Link} to="paymentRecords">Payments</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    {!redirect ? <Button variant='danger' onClick={() => logout()} >Logout {user.username}</Button> : <Redirect to='/'/>}
                                </Nav.Item>  
                            </Nav>                          
                        </Container>
                    </Navbar>
                    }
                </React.Fragment>
            :
                <Navbar variant="light">
                    <Container>
                        <Navbar.Brand>LessonLink</Navbar.Brand>
                        <Nav>
                            <Nav.Item> 
                                <Nav.Link as={Link} to="/"><h5>Home</h5></Nav.Link>
                            </Nav.Item>
                            <Nav.Item> 
                                <Nav.Link as={Link} to="/login"><h5>Login</h5></Nav.Link>
                            </Nav.Item>
                            <Nav.Item> 
                                <Nav.Link as={Link} to="/register"><h5>Register</h5></Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Container>
                </Navbar>
            }
        </React.Fragment>
    )
}