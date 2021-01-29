import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {useSelector, connect} from 'react-redux'

function PrivateRoute({ comp: Component, ...rest }) {
  const {isAuthenticated} = useSelector(state => state.auth)

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated.isLoggedIn ? (
          <Component {...props} />
        ) : (
          <Redirect
            push
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  )
}

export default connect()(PrivateRoute)