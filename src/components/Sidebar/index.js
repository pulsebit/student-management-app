import React, { memo } from 'react'
import { FaUserFriends, FaList } from "react-icons/fa"
import { ImUsers } from "react-icons/im"
import {NavLink} from 'react-router-dom'
import './sidebar.css'

export default memo(function index() {
  return (
    <div className="left-sidebar">
      <ul className="menu">
        <li className="menu__list-item">
          <NavLink activeClassName="active" to="/students" className="menu__link--sublist">
            <ImUsers/>
            <span>Students</span>
          </NavLink>
        </li>
        <li className="menu__list-item">
          <NavLink activeClassName="active" to="/all-payment-dues" className="menu__link--sublist">
            <FaList/>
            <span>All payment dues</span>
          </NavLink>
        </li>
        <li className="menu__list-item">
          <NavLink activeClassName="active" to="/plans" className="menu__link--sublist">
            <FaUserFriends/>
            <span>Plans</span>
          </NavLink>
        </li>
        {/* <li className="menu__list-item">
          <NavLink activeClassName="active" to="/users" className="menu__link--sublist">
            <FaUserFriends/>
            <span>Users</span>
          </NavLink>
        </li> */}
      </ul>
    </div>
  )
})