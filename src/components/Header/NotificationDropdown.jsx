import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import { FaBell } from "react-icons/fa"
// import {Link, useHistory} from 'react-router-dom'
// import {logout} from 'helpers'
// import * as actions from 'actions'
import {connect} from 'react-redux'

export const NotificationDropdown = () => {
  return (
    <Dropdown className="notification-dropdown">
      <Dropdown.Toggle className="notification-dropdown__btn" variant="" id="dropdown-basic">
        <FaBell/>
        <span className="notification__count">8</span>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <div className="header-dropdown">
          <p className="dropdown-title">Notifications</p>
          <button>Mark all as read</button>
        </div>
        <div className="notification_list">
          <React.Fragment>
            <div className="notification_separator">
              Tuesday, November 3, 2020
            </div>
            <div className="notifications__item">
              <a href="#link">
                <div>
                  <span className="bold text_info-title">Lorem ipsum dolor</span>
                  <span className="text__info">Lorem ipsum dolor sit amet consectetur adipisicing elit....</span>
                </div>
              </a>
              <a href="#link">
                <div>
                  <span className="bold text_info-title">Lorem ipsum dolor</span>
                  <span className="text__info">Lorem ipsum dolor sit amet consectetur adipisicing elit....</span>
                </div>
              </a>
              <a href="#link">
                <div>
                  <span className="bold text_info-title">Lorem ipsum dolor</span>
                  <span className="text__info">Lorem ipsum dolor sit amet consectetur adipisicing elit....</span>
                </div>
              </a>
              <a href="#link">
                <div>
                  <span className="bold text_info-title">Lorem ipsum dolor</span>
                  <span className="text__info">Lorem ipsum dolor sit amet consectetur adipisicing elit....</span>
                </div>
              </a>
              <a href="#link">
                <div>
                  <span className="bold text_info-title">Lorem ipsum dolor</span>
                  <span className="text__info">Lorem ipsum dolor sit amet consectetur adipisicing elit....</span>
                </div>
              </a>
            </div>
          </React.Fragment>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationDropdown)
