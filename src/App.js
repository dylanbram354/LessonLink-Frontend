import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Link, Redirect, Switch} from 'react-router-dom';
import useCal from './hooks/useCal';

function App() {

  const { addEvent } = useCal();

  return (
    <div>
      <p>Hello world</p>
      <button onClick={() => {
        addEvent({'dateTime': '2021-07-23T09:00:00-07:00','timeZone': 'America/Los_Angeles'},{'dateTime': '2021-07-23T17:00:00-07:00','timeZone': 'America/Los_Angeles'})}}
        >Add event</button>
    </div>
  );
}

export default App;
