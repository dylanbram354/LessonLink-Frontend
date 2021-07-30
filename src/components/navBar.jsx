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
                        <Navbar variant="dark" bg='dark' collapseOnSelect expand="lg">
                            <Container>
                                <Navbar.Brand as={Link} to='/'>LessonLink</Navbar.Brand>
                                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                                <Navbar.Collapse id="responsive-navbar-nav">
                                    <Nav className='me-auto'>
                                        <Nav.Item className="text-lg"> 
                                            <Nav.Link as={Link} to="/">Students</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link as={Link} to="schedule">Schedule</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link as={Link} to="paymentRecords">Payments</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link as={Link} to="createLesson">Add Lesson</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Nav>
                                        <Navbar.Text>
                                            {!redirect ? <Button variant='danger' onClick={() => logout()} >Logout {user.username}</Button> : <Redirect to='/'/>}
                                        </Navbar.Text>
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                    :
                        <Navbar variant="dark" bg='dark' collapseOnSelect expand="lg">
                            <Container>
                                <Navbar.Brand as={Link} to='/'>LessonLink</Navbar.Brand>
                                <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                                <Navbar.Collapse id="responsive-navbar-nav">
                                    <Nav className='me-auto'>
                                        <Nav.Item className="text-lg"> 
                                            <Nav.Link as={Link} to="/">Teachers</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link as={Link} to="schedule">Schedule</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link as={Link} to="paymentRecords">Payments</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                    <Nav>
                                        <Navbar.Text>
                                            {!redirect ? <Button variant='danger' onClick={() => logout()} >Logout {user.username}</Button> : <Redirect to='/'/>}
                                        </Navbar.Text>  
                                    </Nav>  
                                </Navbar.Collapse>                        
                            </Container>
                        </Navbar>
                    }
                </React.Fragment>
            :
            <React.Fragment>
                <Navbar variant="dark" bg='dark' collapseOnSelect expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to='/'>LessonLink</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className='me-auto'>
                                <Nav.Item> 
                                    <Nav.Link as={Link} to="/">Home</Nav.Link>
                                </Nav.Item>
                                <Nav.Item> 
                                    <Nav.Link as={Link} to="/login">Login</Nav.Link>
                                </Nav.Item>
                                <Nav.Item> 
                                    <Nav.Link as={Link} to="/register">Register</Nav.Link>
                                </Nav.Item>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </React.Fragment>
            }
        </React.Fragment>
    )
}