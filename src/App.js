import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Route, Link, Redirect, Switch} from 'react-router-dom';
import useCal from './helpers/useCal';
import Schedule from './components/schedule';
import Register from './components/register';
import Login from './components/login';
import NavBar from './components/navBar';
import EditLessonForm from './components/editLessonForm';
import CreateLessonForm from './components/createLessonForm';
import LogPaymentForm from './components/logPaymentForm';
import PaymentRecords from './components/paymentRecords';
import LessonRecord from './components/lessonRecord';
import MyRelationships from './components/myRelationships';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/app.scss'

function App() {

  const setInitialUserState = () => {
    const jwt = localStorage.getItem('token');
    if(jwt !== null){
      try{
        let user = jwtDecode(jwt);
        user = {...user, role: user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"], token: jwt};
        return(user)
      }
      catch(err){
        console.log(err);
        alert(err + "\nIn 'getToken'")
      }
    }
    else{
      return null
    }
  }

  const [user, setUser] = useState(setInitialUserState());
  const [token, setToken] = useState(localStorage.getItem('token'));

  // useEffect(() => {getToken()}, []);

  const getToken = () =>{
    const jwt = localStorage.getItem('token');
    if(jwt !== null){
      try{
        let user = jwtDecode(jwt);
        user = {...user, role: user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"], token: jwt};
        setToken(jwt);
        setUser(user);
      }
      catch(err){
        console.log(err);
        alert(err + "\nIn 'getToken'")
      }
    }
  }

  const logout = () =>{
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <div>
      <div>
        <NavBar user={user} logout={logout}/>
      </div>
      <div className="pt-4">
      <Switch>
        {/* <Route path="/" exact render={(props) => (<Schedule {...props} user={user} token={token}/>)} /> */}
        <Route path="/register" component={Register} />
        <Route 
          path='/login' 
          render={props => {
              if (user){
                  return <Redirect to="/" />;
              }
              else{
                  return <Login {...props} getToken={getToken}/>
              }
          }} />
          <Route path="/" exact render={(props) => (<MyRelationships {...props} user={user} token={token}/>)} />
          <Route 
          path='/schedule' 
          render={props => {
              if (!user){
                return <Redirect to="/" />;
              }
              else{
                return <Schedule {...props} user={user} token={token}/>
              }
          }} />
          <Route 
          path='/lessonRecord' 
          render={props => {
              if (!user){
                  return <Redirect to="/" />;
              }
              else{
                  return <LessonRecord {...props} user={user}/>
              }
          }} />
          <Route 
          path='/editLesson' 
          render={props => {
              if (!user){
                return <Redirect to="/" />;
              }
              else if (user.role != "Teacher"){
                return <Redirect to="/" />;
              }
              else{
                return <EditLessonForm {...props} user={user}/>
              }
          }} />
          <Route 
          path='/payment' 
          render={props => {
              if (!user){
                return <Redirect to="/" />;
              }
              else if (user.role != "Teacher"){
                return <Redirect to="/" />;
              }
              else{
                return <LogPaymentForm {...props} user={user}/>
              }
          }} />
          <Route 
          path='/paymentRecords' 
          render={props => {
              if (!user){
                return <Redirect to="/" />;
              }
              else{
                return <PaymentRecords {...props} user={user}/>
              }
          }} />
          <Route 
          path='/createLesson' 
          render={props => {
              if (!user){
                return <Redirect to="/" />;
              }
              else if (user.role != "Teacher"){
                return <Redirect to="/" />;
              }
              else{
                return <CreateLessonForm {...props} user={user}/>
              }
          }} />
      </Switch>
      </div>
    </div>
  );
}

export default App;
