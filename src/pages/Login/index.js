import React, {useState} from 'react'
import logo from 'ecom-horizontal-reverse.png'
import {Link, Redirect, useHistory} from 'react-router-dom'
import './index.css'
import {connect, useSelector} from 'react-redux'
import axios from 'axios'
import * as actions from 'actions'

const Login = ({dispatch, location}) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const history = useHistory()
  const {isAuthenticated} = useSelector(state => state.auth)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setError(false)
    axios.post('/api/user/login', {email, password})
        .then(res => {
          setLoading(false)
          if (res.data.error) {
            setError(true)
            setErrorMessage(res.data.error)
          }
          if (res.data.isLoggedIn === true) {
            dispatch({
              type: actions.IS_AUTHENTICATE, 
              isAuthenticated: {
                isLoggedIn: res.data.isLoggedIn,
                user: res.data.user
              }
            })
            if (location.state) {
              history.push(location.state.from.pathname)
            } else {
              history.push('/students')
            }
          }
        })
        .catch(err => {
          setError(true)
          setErrorMessage(err.message)
          console.log(err)
          setLoading(false)
        })
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value)
  }

  if (isAuthenticated.isLoggedIn) {
    return <Redirect to="/students" />
  }

  return (
    <div className="Login">
      <div className="form-wrapper">
        <div className="form-header">
          <img src={logo} alt="Logo" className="logo-img"/>
        </div>
        <div className="form-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <input className="form-control form-control-lg" type="email" placeholder="Email" required 
                value={email}
                onChange={handleEmailChange} 
              />
            </div>
            <div className="form-group">
              <input className="form-control form-control-lg" type="password" placeholder="Password" required
                value={password}
                onChange={handlePasswordChange} 
              />
            </div>
            <div className="form-group">
              <button disabled={loading} className="btn btn-default btn-lg">Login</button>
            </div>
            {error ? (
              <div className="alert alert-warning">{errorMessage}</div>
            ): ''}
          </form>
        </div>
        <div className="form-footer">
          <Link to="/forgot-password">Forgot Password</Link>
        </div>
      </div>
    </div>
  )
}

export default connect()(Login)
