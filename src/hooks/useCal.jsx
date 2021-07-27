import React, { useState, useEffect } from 'react';
import axios from 'axios';

const useCal = (props) => {

    var gapi = window.gapi;
    var CLIENT_ID = "333847482327-0in4cnc0carqsvq0tev7r544ptc1l5r3.apps.googleusercontent.com";
    var API_KEY="AIzaSyA7jL3_fvnilsH0NfcGFG9TyVOAQKkNZN8";
    var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];
    var SCOPES = "https://www.googleapis.com/auth/calendar.events";

    const addEvent = async ( startObject, endObject, summaryString = 'Lesson', callback) => {
        
        await gapi.load('client:auth2', async () => {
            console.log('loaded client');

            gapi.client.init({
                apiKey: API_KEY,
                clientId: CLIENT_ID,
                discoveryDocs: DISCOVERY_DOCS,
                scope: SCOPES
            });


            gapi.client.load('calendar', 'v3', () => {console.log('calendar loaded')});

            await gapi.auth2.getAuthInstance().signIn();
            var event = {
                        'summary': summaryString,
                        'start': startObject,
                        'end': endObject
                    };
                    
            var request = gapi.client.calendar.events.insert({
                'calendarId': 'primary',
                'resource': event,
            })

            request.execute(async (newEvent) => {
                console.log('Event created with id: ' + newEvent.id);
                await callback(newEvent.id);
                window.open(newEvent.htmlLink);
            })
        })
    }

    const logoutGoogle = () =>{
        gapi.auth2.getAuthInstance().signOut();
    }

    return { addEvent, logoutGoogle }
}

export default useCal