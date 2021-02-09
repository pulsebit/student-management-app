import React from 'react';
import {BrowserRouter, Redirect, Route, Switch} from 'react-router-dom';
import './App.css';
import Login from 'pages/Login'
import PrivateRoute from 'components/PrivateRoute'
import Student from 'pages/Student'
// import Dashboard from 'pages/Dashboard'
import Tag from 'pages/Tag'
import Users from 'pages/Users';
import Plans from 'pages/Plans';
import Notifications from 'pages/Notifications'

function App() {
  return (
    <BrowserRouter>
      <Switch>
        {/* <PrivateRoute exact path="/dashboard" comp={Dashboard}/> */}
        <Route exact path="/login" component={Login} />
        <PrivateRoute path="/students" comp={Student}/>
        <PrivateRoute path="/all-payment-dues" comp={Notifications}/>
        <PrivateRoute path="/tag" comp={Tag}/>
        <PrivateRoute path="/users" comp={Users}/>
        <PrivateRoute path="/plans" comp={Plans}/>
        <Redirect from="/" to="/students" />
        <Redirect from="/dashboard" to="/students"  />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
