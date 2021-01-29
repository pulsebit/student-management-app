import BaseLayout from 'components/BaseLayout'
import PrivateRoute from 'components/PrivateRoute'
import React from 'react'
import { connect } from 'react-redux'
import { Switch, useRouteMatch } from 'react-router-dom'
import { CreatePan } from './CreatePan'
import { EditPlan } from './EditPlan'
import { PlanLists } from './PlanLists'

export const Plans = (props) => {
  const {url} = useRouteMatch()

  return (
    <BaseLayout>

      <Switch>
        <PrivateRoute exact path={url} comp={PlanLists} />
        <PrivateRoute exact path={`${url}/create`} comp={CreatePan} />
        <PrivateRoute exact path={`${url}/edit/:planId`} comp={EditPlan} />
      </Switch>
      
    </BaseLayout>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(Plans)
