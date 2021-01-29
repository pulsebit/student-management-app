import React from 'react'
import { connect } from 'react-redux'
import { FaPlus } from "react-icons/fa"
import Dropdown from 'react-bootstrap/Dropdown'

export const QuickAddDropdown = () => {
  return (
    <Dropdown className="quick-add-dropdown">
      <Dropdown.Toggle className="quick-add-dropdown__btn" variant="" id="dropdown-basic">
        <FaPlus/>
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>
          Quick Add
        </Dropdown.Header>
        <div className="content">
          <button>Student</button>
          <button>Form</button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  )
}

const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(QuickAddDropdown)
