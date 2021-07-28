import React, { useState, useEffect } from 'react';

const useDates = () => {

    function sortLessonsByDate(lessons){
        let upcoming = [];
        let today = []
        let past = [];
        let now = new Date();
        lessons.map(lesson => {
            let date = new Date(lesson.startTime);
            if (date.setHours(0,0,0,0) == now.setHours(0,0,0,0)){
                today.push(lesson);
            }
            else if (date.setHours(0,0,0,0) > now.setHours(0,0,0,0)){
                upcoming.push(lesson);
            }
            else{
                past.push(lesson);
            }
        })
        today.sort(function(a,b){return a.startTime.localeCompare(b.startTime)});
        past.sort(function(a,b){return a.startTime.localeCompare(b.startTime)});
        upcoming.sort(function(a,b){return a.startTime.localeCompare(b.startTime)});
        return { past: past, today: today, upcoming: upcoming}
    }

    function sortLessonsByExactTime(lessons){
        let upcoming = [];
        let past = [];
        let now = new Date().getTime();
        lessons.map(lesson => {
            let date = new Date(lesson.endTime).getTime();
            if (date > now){
                upcoming.push(lesson);
            }
            else{
                past.push(lesson);
            }
        })
        past.sort(function(a,b){return a.startTime.localeCompare(b.startTime)});
        upcoming.sort(function(a,b){return a.startTime.localeCompare(b.startTime)});
        return { past: past, upcoming: upcoming}
    }
    
    function getTimeFromDateObject(d){
        let h = d.getHours();
        let m = d.getMinutes();
        if (m == 0){
            m ='00'
        }
        else if (0 < m && m < 10){
            m = '0'+`${m}`;
        }
        let amPm = 'AM';
        if (h > 12){
            h = h - 12;
            amPm = 'PM';
        }
        return (`${h}:${m} ${amPm}`)
    }
    
    function getDateFromDateObject(d){
        let day = d.getDate();
        let year = d.getFullYear();
        let month = d.getMonth()+1;
        return (`${month}/${day}/${year}`)
    }

    return { sortLessonsByDate, sortLessonsByExactTime, getTimeFromDateObject, getDateFromDateObject }

}

export default useDates


