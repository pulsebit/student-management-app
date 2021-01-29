import React from 'react'
import logo from 'ecom-horizontal-reverse.png'
// import { FaBell, FaCog } from "react-icons/fa"
import {connect} from 'react-redux'
import './header.css'
import ProfileDropdown from './ProfileDropdown'
// import QuickAddFropdown from './QuickAddDropdown'
import { Link } from 'react-router-dom'

const Header = ({children}) => {
    return (
		<header className="Header">
			<div className="left-content">
				<Link to="/dashboard">
					<img className="logo-img" src={logo} alt="Logo"/>
				</Link>
			</div>
			<div className="right-content">
				<div className="links">
					<Link to="/students/create" className="student__new-btn">Add Student</Link>
				</div>
				<ProfileDropdown/>	
			</div>
    </header> 
		)
}

export default connect()(Header)

