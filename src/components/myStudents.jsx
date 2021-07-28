import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function MyStudents(props){

    const [user, setUser] = useState(props.user);
    const [myStudents, setMyStudents] = useState(null);
    const [sortedLessons, setSortedLessons] = useState(null);

    useEffect(() => {
        getMyStudentsAndLessons();
    }, []);

    async function getMyStudentsAndLessons(){
        try{
            let response = await axios.get(`https://localhost:44394/api/users/my_students`, {headers: {Authorization: 'Bearer ' + user.token}});
            let students = response.data;
            let lessons = await Promise.all(students.map(async student => {
                let lessonList = await getLessonsByRelationshipId(student.relationshipId);
                return {
                    relationshipId: student.relationshipId,
                    lessons: lessonList
                }
            }));
            setSortedLessons(lessons);
            setMyStudents(students);
        }
        catch(err){
            alert('Error getting students.\n' + err)
        }
    }

    async function getLessonsByRelationshipId(id){
        try{
            let response = await axios.get(`https://localhost:44394/api/lessons/relationshipId=${id}`, {headers: {Authorization: 'Bearer ' + user.token}});
            let lessons = response.data;
            return lessons
        }
        catch(err){
            alert('Error getting lessons\n' + err)
        }
    }

    function generateLessonLinkOption(lesson){
        return <Dropdown.Item as={Link} to={{pathname: '/lessonRecord', state: { lessonId: lesson.lessonId }}}>Lesson Id: {lesson.lessonId}</Dropdown.Item> 
    }

    function generateStudentCard(student){
        let studentLessons = sortedLessons.filter(item => {return item.relationshipId == student.relationshipId})[0].lessons;
        return(
            <Card className='ml-2 mr-2'>
                <Card.Body>
                    <Card.Title>{student.student.firstName} {student.student.lastName}</Card.Title>
                    <Card.Text>
                        {student.student.email} <br />
                        {student.student.phoneNumber} <br />
                        Parent email: {student.student.parentEmail} <br />
                        Outstanding balance: ${student.balance} <br />
                        <Dropdown>
                            <Dropdown.Toggle >
                                Lesson records
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {studentLessons.map(lesson => generateLessonLinkOption(lesson))}
                            </Dropdown.Menu>
                        </Dropdown>
                        <Button>Post Document (modal?)</Button>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    function generateStudentDisplay(){
        let cardDisplay = [];

        for (let i=0; i<myStudents.length; i = i+3){
            cardDisplay.push(
                <div key='i' className='row mt-4'>
                    {myStudents[i] ?
                        <div className='col-12 col-md-4'>
                            {generateStudentCard(myStudents[i])}
                        </div>
                        :
                        <div className='col-12 col-md-4' />
                    }
                    {myStudents[i+1] ?
                        <div className='col-12 col-md-4'>
                            {generateStudentCard(myStudents[i+1])}
                        </div>
                        :
                        <div className='col' />
                    }
                    {myStudents[i+2] ?
                        <div className='col'>
                            {generateStudentCard(myStudents[i+2])}
                        </div>
                        :
                        <div className='col' />
                    }
                </div>
            )
        }

        return(
            <React.Fragment>
                {cardDisplay}
            </React.Fragment>
        )
    }

    return(
        <React.Fragment>
            <h1 className='text-center'>List of students goes here. Include links to lesson records and documents.</h1>
            {myStudents && sortedLessons ? 
            <div className='row'>
                <div className= 'col' />
                <div className= 'col-10'>
                    {generateStudentDisplay()}
                </div>
                <div className='col' />
            </div>
            
            :
            <p className='text-center'>Loading students...</p>
            }
        </React.Fragment>
    )
}