import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useCal = (props) => {

    var gapi = window.gapi;
    var CLIENT_ID = "333847482327-0in4cnc0carqsvq0tev7r544ptc1l5r3.apps.googleusercontent.com";
    var API_KEY="AIzaSyA7jL3_fvnilsH0NfcGFG9TyVOAQKkNZN8";
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var SCOPES = "https://www.googleapis.com/auth/calendar.events";

    const addEvent = ( startObject, endObject, summaryString = 'Lesson', attendeesArrayObjects = []) => { 
        gapi.load('client:auth2', () => {
            console.log('loaded client');

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            })


            gapi.client.load('calendar', 'v3', () => {console.log('calendar loaded')});

            gapi.auth2.getAuthInstance().signIn()
            .then(
                () => {
                    var event = {
                        'summary': summaryString,
                        'start': startObject
                        // {
                        //   'dateTime': '2015-05-28T09:00:00-07:00',
                        //   'timeZone': 'America/Los_Angeles'
                        // }
                        ,
                        'end': endObject
                        // {
                        //   'dateTime': '2015-05-28T17:00:00-07:00',
                        //   'timeZone': 'America/Los_Angeles'
                        // }
                        ,
                        'recurrence': [
                          'RRULE:FREQ=DAILY;COUNT=1'
                        ],
                        'attendees': attendeesArrayObjects
                        // [
                        //   {'email': 'lpage@example.com'},
                        //   {'email': 'sbrin@example.com'}
                        // ]
                        ,
                        // 'reminders': {
                        //   'useDefault': false,
                        //   'overrides': [
                        //     {'method': 'email', 'minutes': 24 * 60},
                        //     {'method': 'popup', 'minutes': 10}
                        //   ]
                        // }
                    };
                    
                    var request = gapi.client.calendar.events.insert({
                        'calendarId': 'primary',
                        'resource': event,
                    })

                    request.execute(newEvent => {
                        console.log('Event created with id: ' + newEvent.id);
                        window.open(newEvent.htmlLink);
                    })
                });
        })
        
    }


    return { addEvent }
}

export default useCal