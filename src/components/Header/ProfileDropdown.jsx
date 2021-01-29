import React, {useCallback} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaAngleDown } from "react-icons/fa"
import { useHistory} from 'react-router-dom'
import {logout} from 'helpers'
import * as actions from 'actions'
import {connect} from 'react-redux'

const ProfileDropdown = ({dispatch}) => {
  const history = useHistory()

  const handleLogout = useCallback(() => {
    logout(() => {
      setTimeout(() => {
        dispatch({
          type: actions.IS_AUTHENTICATE, 
          isAuthenticated: {
            isLoggedIn: false,
            user: null
          }
        })
        history.push('/login')
      }, 500)
    })
    return () => {}
  }, [dispatch, history])

  return (
    <div className="profile">
      <Dropdown>
        <Dropdown.Toggle className="profile__image" variant="" id="dropdown-basic">
          <img src='https://lh3.googleusercontent.com/-6Gy1FKnYsZg/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclJGVxP6IiJXfEhLWCfKQUggNyGQA/s48-c/photo.jpg' alt="Profile"/>
          <FaAngleDown/>
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {/* <Dropdown.Header>
            <Link to="/">
              <div className="profile__header-dropdown">
                <img src='https://lh3.googleusercontent.com/-6Gy1FKnYsZg/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclJGVxP6IiJXfEhLWCfKQUggNyGQA/s48-c/photo.jpg' alt="Profile"/>
                <div>
                  <span className="bold">July Cabigas</span>
                  <span className="">View Profile</span>
                </div>
              </div>
            </Link>
          </Dropdown.Header>
          <Dropdown.Divider /> */}
          <div className="btn-wrapper">
            <button className="btn btn-sm dropdown-link"
              onClick={handleLogout}>Logout</button>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}

export default connect()(ProfileDropdown)
