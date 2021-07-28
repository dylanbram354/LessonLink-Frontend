import React, { useState, useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Route, Link, Redirect, Switch} from 'react-router-dom';
import useCal from './hooks/useCal';
import LandingPage from './components/landingPage';
import Register from './components/register';
import Login from './components/login';
import NavBar from './components/navBar';
import EditLessonForm from './components/editLessonForm';
import CreateLessonForm from './components/createLessonForm';
import LogPaymentForm from './components/logPaymentForm';
import PaymentRecords from './components/paymentRecords';
import LessonRecord from './components/lessonRecord';
import MyStudents from './components/myStudents';

function App() {

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {getToken()}, []);

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
    <React.Fragment>
      <NavBar user={user} logout={logout}/>
      <Switch>
        <Route path="/" exact render={(props) => (<LandingPage {...props} user={user} token={token}/>)} />
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
          <Route 
          path='/myStudents' 
          render={props => {
              if (!user){
                return <Redirect to="/" />;
              }
              else if (user.role != "Teacher"){
                return <Redirect to="/" />;
              }
              else{
                return <MyStudents {...props} user={user}/>
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
    </React.Fragment>
  );
}

export default App;
