import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, Form, Button, DropdownButton, Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import useDates from '../helpers/useDates';
import DocumentUploadForm from './documentUploadForm';
import DocumentDropdown from './documentDropdown';
import useCal from '../helpers/useCal';

export default function MyRelationships(props){

    const [user, setUser] = useState(props.user);
    const [myStudents, setMyStudents] = useState(null);
    const [otherStudents, setOtherStudents] = useState(null);
    const [myTeachers, setMyTeachers] = useState(null);
    const [otherTeachers, setOtherTeachers] = useState(null);
    const [sortedLessons, setSortedLessons] = useState(null);
    const { sortLessonsByDate, sortLessonsByExactTime, getTimeFromDateObject, getDateFromDateObject } = useDates();
    const {addEvent, deleteEvent} = useCal();

    useEffect(async () => {
        if(props.user != null){
            if (user.role === 'Teacher'){
                await getMyStudentsAndLessons();
            }
            else{
                await getMyTeachersAndLessons();
            }
        }
        else{
            setUser(null);
        }
    }, [props.user]);

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
            getOtherStudents(students);
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
            getOtherTeachers(teachers);
            setSortedLessons(lessons);
            setMyTeachers(teachers);
        }
        catch(err){
            alert('Error getting your teachers.\n' + err)
        }
    }

    async function getOtherTeachers(myTeachers){
        try {
            let response = await axios.get(`https://localhost:44394/api/users/teachers`);
            let allTeachers = response.data;
            let myTeacherIds = myTeachers.map(t => {return t.teacher.id});
            let otherTeachers = allTeachers.filter(t => {
                return !myTeacherIds.includes(t.id);
            })
            setOtherTeachers(otherTeachers);
        }
        catch(err){
            alert('Error finding all teachers.\n' + err);
        }
    }

    async function getOtherStudents(myStudents){
        try {
            let response = await axios.get(`https://localhost:44394/api/users/students`);
            let allStudents = response.data;
            let myStudentIds = myStudents.map(s => {return s.student.id});
            let otherStudents = allStudents.filter(s => {
                return !myStudentIds.includes(s.id);
            })
            setOtherStudents(otherStudents);
        }
        catch(err){
            alert('Error finding all students.\n' + err);
        }
    }

    async function addRelationship(otherPersonsId){
        try{
            let response = await axios.post(`https://localhost:44394/api/relationships`, { id: otherPersonsId }, {headers: {Authorization: 'Bearer ' + user.token}});
            console.log(response.data);
            if (user.role === 'Teacher'){
                await getMyStudentsAndLessons();
            }
            else{
                await getMyTeachersAndLessons();
            }
        }
        catch(err){
            alert('Error adding relationship!\n' + err)
        }
    }

    async function breakup(person){
        if(window.confirm(`This will permanently remove your relationship with ${person.firstName} ${person.lastName}, including all your shared lessons and payment records.\nAre you sure you want to do this?`)){
            let response = await axios.delete(`https://localhost:44394/api/relationships/breakup/${person.id}`, {headers: {Authorization: 'Bearer ' + user.token}});
            console.log(response.data)
            if (user.role === 'Teacher'){
                let studentsUpdated = myStudents.filter(t => {
                    return !(t.student.id === person.id)
                })
                setMyStudents(studentsUpdated);
                getOtherStudents(studentsUpdated);
            }
            else{
                let teachersUpdated = myTeachers.filter(t => {
                    return !(t.teacher.id === person.id)
                })
                setMyTeachers(teachersUpdated);
                getOtherTeachers(teachersUpdated);
            }
        }
    }

    function generateRelationshipDropdown(person){
        return (
            <Dropdown.Item onClick={() => {addRelationship(person.id)}}>
                {person.firstName} {person.lastName}
            </Dropdown.Item> 
        )
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

    async function cancelLesson(lesson){
        if (window.confirm("Are you sure? This will delete your record of this lesson along with any associated Google Calendar events.")){
            try{
                if(lesson.googleEventId != null){
                    await deleteEvent(lesson.googleEventId);
                }
                let response = await axios.delete(`https://localhost:44394/api/lessons/delete/${lesson.lessonId}`, { headers: {Authorization: "Bearer " + user.token}});
                console.log(response.data);
                await getMyStudentsAndLessons();
            }
            catch(err){
                alert(err)
            }
        }
    }

    function generateLessonLinkOption(lesson){
        return <Dropdown.Item>
            <Link to={{pathname: '/lessonRecord', state: { lessonId: lesson.lessonId }}}>{getDateFromDateObject(new Date(lesson.startTime))}, {getTimeFromDateObject(new Date(lesson.startTime))} - {getTimeFromDateObject(new Date(lesson.endTime))}</Link>
            {/* {user.role === 'Teacher' && <Button size='sm' className='m-3' variant='danger' onClick={() => cancelLesson(lesson)}>Delete</Button>} */}
        </Dropdown.Item> 
    }

    function generateLessonDropdowns(lessons){
        let sortedLessons = sortLessonsByExactTime(lessons);
        return(
            <div className='row mt-4 mb-4'>
                <div className='col text-center mt-1 mb-1'>
                    <Dropdown>
                        <Dropdown.Toggle variant='warning'>
                            Past Lessons
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {sortedLessons.past.length > 0 ? sortedLessons.past.reverse().map(lesson => generateLessonLinkOption(lesson)) : <p>No lessons found.</p>}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className='col text-center mt-1 mb-1'>
                    <Dropdown>
                        <Dropdown.Toggle variant='warning'>
                            Scheduled Lessons
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            {sortedLessons.upcoming.length > 0 ? sortedLessons.upcoming.reverse().map(lesson => generateLessonLinkOption(lesson)) : <p>No lessons found.</p>}
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>
        )
    }

    function generateStudentCard(student){
        let studentLessons = sortedLessons.filter(item => {return item.relationshipId == student.relationshipId})[0].lessons;
        return(
            <Card className='ml-2 mr-2 text-center card-custom'>
                <Card.Body>
                    <Card.Title className='row'>
                        <div className='col'>{student.student.firstName} {student.student.lastName}</div>
                    </Card.Title>
                    <Card.Text>
                        <div>
                            {student.student.email} <br />
                            {student.student.phoneNumber} <br />
                            Parent email: {student.student.parentEmail} <br />
                            Outstanding balance: ${student.balance} <br />
                        </div>
                        <Button size='sm' variant='danger' className='m-2' onClick={() => breakup(student.student)}>Drop {student.student.firstName}</Button>
                        <div className='mt-4 mb-4' style={{border: '2px solid grey', borderRadius: '10px'}}>
                            <h5 className='mt-2'>Files</h5>
                            <div className='row'>
                                <div className='col text-center m-2'>
                                    <DocumentDropdown user={user} relationshipId={student.relationshipId}/>
                                </div>
                                <div className='col text-center m-2'>
                                    <DocumentUploadForm user={user} student={student}/>
                                </div>
                            </div>
                        </div>
                        <div className='mt-4 mb-4'>
                            {generateLessonDropdowns(studentLessons)}
                            <div>
                                <Button as={Link} to={{pathname: '/createLesson', state: { student: student.student }}}>Add Lesson</Button>
                            </div>
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    function generateTeacherCard(teacher){
        let studentLessons = sortedLessons.filter(item => {return item.relationshipId == teacher.relationshipId})[0].lessons;
        console.log(teacher);
        return(
            <Card className='ml-2 mr-2 card-custom'>
                <Card.Body>
                    <Card.Title className='row'>
                        <div className='col'>{teacher.teacher.firstName} {teacher.teacher.lastName}</div>
                        <div className='col d-flex justify-content-end'>
                            <Button size='sm' variant='danger' onClick={() => breakup(teacher.teacher)}>Leave Teacher</Button>
                        </div>
                    </Card.Title>
                    <Card.Text>
                        {teacher.teacher.email} <br />
                        {teacher.teacher.phoneNumber} <br />
                        Preferred contact: {teacher.teacher.preferredContact} <br />
                        Outstanding balance: ${teacher.balance} <br />
                        <h5 className='mt-2'>Lesson Sheets:</h5>
                        {generateLessonDropdowns(studentLessons)}
                        <div className='mt-4' style={{border: '2px solid grey', borderRadius: '10px'}}>
                            <div className='row text-center mt-2 mb-2'>
                                <h5 className='col'>Files:</h5>
                                <div className='col'>
                                    <DocumentDropdown user={user} relationshipId={teacher.relationshipId}/>
                                </div>
                            </div>
                        </div>
                    </Card.Text>
                </Card.Body>
            </Card>
        )
    }

    function generateStudentDisplay(){
        let cardDisplay = [];

        for (let i=0; i<myTeachers.length; i = i+3){
            cardDisplay.push(
                <div key={i} className='row mt-4'>
                    {myTeachers[i+1] ?
                        <div className='col-12 col-md-4'>
                            {generateTeacherCard(myTeachers[i+1])}
                        </div>
                        :
                        <div className='col-12 col-md-4' />
                    }
                    {myTeachers[i] ?
                        <div className='col-12 col-md-4'>
                            {generateTeacherCard(myTeachers[i])}
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
                {cardDisplay.length > 0 ? cardDisplay : <p className='text-center'>No teachers to display.</p>}
            </React.Fragment>
        )
    }

    function generateTeacherDisplay(){
        let cardDisplay = [];

        for (let i=0; i<myStudents.length; i = i+3){
            cardDisplay.push(
                <div key={i} className='row mt-4'>
                    {myStudents[i+1] ?
                        <div className='col-12 col-md-4'>
                            {generateStudentCard(myStudents[i+1])}
                        </div>
                        :
                        <div className='col-12 col-md-4' />
                    }
                    {myStudents[i] ?
                        <div className='col-12 col-md-4'>
                            {generateStudentCard(myStudents[i])}
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
                {cardDisplay.length > 0 ? cardDisplay : <p className='text-center'>No students to display.</p>}
            </React.Fragment>
        )
    }

    return(
        <React.Fragment>
        {user ? 
            <React.Fragment>
                {user.role === 'Teacher' ? 
                <React.Fragment>
                    <h1 className='text-center'>Students</h1>
                    <div className='text-center'>
                        {otherStudents && myStudents && 
                        <div className='text-center m-2'>
                            <Dropdown>
                                <Dropdown.Toggle variant='light'>
                                    Add
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {otherStudents.length > 0 ? otherStudents.map(student => generateRelationshipDropdown(student)) : <p>No students found.</p>}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        }
                    </div>
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
                    <div className='text-center'>
                        {otherTeachers && myTeachers && 
                        <div className='text-center m-2'>
                            <Dropdown>
                                <Dropdown.Toggle variant='light'>
                                    Add
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    {otherTeachers.length > 0 ? otherTeachers.map(teacher => generateRelationshipDropdown(teacher)) : <p>No teachers found.</p>}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>
                        }
                    </div>
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
        :
        <h1 className='text-center'>Welcome to LessonLink! Please login or create an account.</h1>
        }
    </React.Fragment>
    )
}