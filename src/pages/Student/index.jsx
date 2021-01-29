import PrivateRoute from 'components/PrivateRoute'
import React from 'react'
import {Switch} from 'react-router-dom'
import { connect } from 'react-redux'
import { useRouteMatch } from 'react-router-dom'
import './index.css'
import { CreateStudent } from './CreateStudent'
import StudentInfo from './StudentInfo'
import StudentList from './StudentLists'
import StudentEdit from './StudentEdit'

export const Student = () => {
  const {path} = useRouteMatch()

  return (
    <Switch>
      <PrivateRoute exact path={`${path}`} comp={StudentList}/>
      <PrivateRoute exact path={`${path}/create`} comp={CreateStudent} />
      <PrivateRoute exact path={`${path}/edit/:studentID`} comp={StudentEdit} />
      <PrivateRoute path={`${path}/:studentID`} comp={StudentInfo} />
    </Switch>
  )
}

export default connect()(Student)
