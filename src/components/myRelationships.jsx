import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useDates from '../hooks/useDates';
import DocumentUploadForm from './documentUploadForm';
import DocumentDropdown from './documentDropdown';

export default function MyRelationships(props){

    const [user, setUser] = useState(props.user);
    const [myStudents, setMyStudents] = useState(null);
    const [sortedLessons, setSortedLessons] = useState(null);
    const [myTeachers, setMyTeachers] = useState(null);
    const { sortLessonsByDate, sortLessonsByExactTime, getTimeFromDateObject, getDateFromDateObject } = useDates();

    useEffect(() => {
        if (user.role === 'Teacher'){
            getMyStudentsAndLessons();
        }
        else{
            getMyTeachersAndLessons();
        }
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

    async function getMyTeachersAndLessons(){
        try{
            let response = await axios.get(`https://localhost:44394/api/users/my_teachers`, {headers: {Authorization: 'Bearer ' + user.token}});
            let teachers = response.data;
            let lessons = await Promise.all(teachers.map(async teacher => {
                let lessonList = await getLessonsByRelationshipId(teacher.relationshipId);
                return {
                    relationshipId: teacher.relationshipId,
                    lessons: lessonList
                }
            }));
            console.log(teachers);
            setSortedLessons(lessons);
            setMyTeachers(teachers);
        }
        catch(err){
            alert('Error getting teachers.\n' + err)
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
        return <Dropdown.Item as={Link} to={{pathname: '/lessonRecord', state: { lessonId: lesson.lessonId }}}>
            {getDateFromDateObject(new Date(lesson.startTime))}, {getTimeFromDateObject(new Date(lesson.startTime))} - {getTimeFromDateObject(new Date(lesson.endTime))}
        </Dropdown.Item> 
    }

    function generateLessonDropdowns(lessons){
        let sortedLessons = sortLessonsByExactTime(lessons);
        return(
            <div className='row'>
                <div className='col text-center m-2'>
                    <Dropdown>
                        <Dropdown.Toggle variant='info'>
                            Past
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {sortedLessons.past.reverse().map(lesson => generateLessonLinkOption(lesson))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='col text-center m-2'>
                    <Dropdown>
                        <Dropdown.Toggle variant='warning'>
                            Upcoming
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {sortedLessons.upcoming.reverse().map(lesson => generateLessonLinkOption(lesson))}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        )
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
                        <h5 className='mt-2'>Lessons:</h5>
                        {generateLessonDropdowns(studentLessons)}
                        <h5 className='mt-2'>Files:</h5>
                        <div className='row'>
                            <div className='col text-center m-2'>
                                <DocumentDropdown user={user} relationshipId={student.relationshipId}/>
                            </div>
                            <div className='col text-center m-2'>
                                <DocumentUploadForm user={user} student={student}/>
                            </div>
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    function generateTeacherCard(teacher){
        let studentLessons = sortedLessons.filter(item => {return item.relationshipId == teacher.relationshipId})[0].lessons;
        return(
            <Card className='ml-2 mr-2'>
                <Card.Body>
                    <Card.Title>{teacher.teacher.firstName} {teacher.teacher.lastName}</Card.Title>
                    <Card.Text>
                        {teacher.teacher.email} <br />
                        {teacher.teacher.teacher} <br />
                        Preferred contact: {teacher.teacher.preferredContact} <br />
                        Outstanding balance: ${teacher.balance} <br />
                        <h5 className='mt-2'>Lessons:</h5>
                        {generateLessonDropdowns(studentLessons)}
                        <h5 className='mt-2'>Files:</h5>
                        <div className='row'>
                            <div className='col text-center m-2'>
                                <DocumentDropdown user={user} relationshipId={teacher.relationshipId}/>
                            </div>
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    function generateStudentDisplay(){
        console.log('rendering')
        let cardDisplay = [];

        for (let i=0; i<myTeachers.length; i = i+3){
            cardDisplay.push(
                <div key='i' className='row mt-4'>
                    {myTeachers[i] ?
                        <div className='col-12 col-md-4'>
                            {generateTeacherCard(myTeachers[i])}
                        </div>
                        :
                        <div className='col-12 col-md-4' />
                    }
                    {myTeachers[i+1] ?
                        <div className='col-12 col-md-4'>
                            {generateTeacherCard(myTeachers[i+1])}
                        </div>
                        :
                        <div className='col' />
                    }
                    {myTeachers[i+2] ?
                        <div className='col'>
                            {generateTeacherCard(myTeachers[i+2])}
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

    function generateTeacherDisplay(){
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
            {user.role === 'Teacher' ? 
            <React.Fragment>
                <h1 className='text-center'>Students</h1>
                {myStudents && sortedLessons ? 
                <React.Fragment>
                    <div className='row'>
                        <div className='col'/>
                        <div className= 'col-10'>
                            {generateTeacherDisplay()}
                        </div>
                        <div className='col'/>
                    </div>
                </React.Fragment>
                :
                <p className='text-center'>Loading...</p>
                }
            </React.Fragment>
            :
            <React.Fragment>
                <h1 className='text-center'>Teachers</h1>
                {myTeachers && sortedLessons ? 
                <React.Fragment>
                    <div className='row'>
                        <div className='col'/>
                        <div className= 'col-10'>
                            {generateStudentDisplay()}
                        </div>
                        <div className='col'/>
                    </div>
                </React.Fragment>
                :
                <p className='text-center'>Loading...</p>
                }
            </React.Fragment>}
        </React.Fragment>
    )
}