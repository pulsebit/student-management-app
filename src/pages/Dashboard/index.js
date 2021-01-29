import React from 'react'
import BaseLayout from 'components/BaseLayout'
import {connect} from 'react-redux'
import './dashboard.css'
import { Link } from 'react-router-dom'
import { FaPlus } from 'react-icons/fa'


const Dashboard = ({dispatch}) => {
  return (
    <BaseLayout>
      <div className="container">
        <div className="Dashboard">
        <h2 style={{marginBottom: '20px'}}>Dashboard</h2>
          <div className="row">
            <div className="col-md-3">
            <Link className="tab__link add_tab" to="/tab/create">
              <FaPlus/>
              <span className="add_tab-text">Add Tab</span>
            </Link>
            </div>       
            <div className="col-md-3">
              <Link to="/sales-guy" className="tab__link">
                <span className="tab__text">Sales</span>
              </Link>
            </div> 
            <div className="col-md-3">
              <Link to="/student/s" className="tab__link">
                <span className="tab__text">Student</span>
              </Link>
            </div>  
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default connect()(Dashboard)
