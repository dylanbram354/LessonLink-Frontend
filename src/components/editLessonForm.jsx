import React, { useState, useEffect } from 'react';

export default function EditLessonForm(props){

    return(
        <div>
            <h1>Edit lesson {props.location.state.lesson.lessonId}</h1>
        </div>
    )
}