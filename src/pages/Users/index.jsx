import BaseLayout from 'components/BaseLayout'
import React from 'react'
import { connect } from 'react-redux'
import { FaEye, FaPen, } from "react-icons/fa"


const user_pic = 'https://lh3.googleusercontent.com/-6Gy1FKnYsZg/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclJGVxP6IiJXfEhLWCfKQUggNyGQA/s48-c/photo.jpg';

const index = () => {
  return (
    <BaseLayout>
      <div className="table-responsive table_wrapper">
        <table className="table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th> 
              <th>Status</th> 
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="photo">
                  <img src={user_pic} alt="Joemy" />
                </div>
              </td>
              <td>Joemy</td>
              <td>09122911792</td>
              <td>jayflores139@gmail.com</td>
              <td>
                <span className="user_status__active user_status">Active</span>
              </td>
              <td>Editor</td>
              <td>
                <button className="btn btn-sm view_btn mr-2"><FaEye/> View</button>
                <button className="btn btn-sm app-primary-btn"><FaPen/> Edit</button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="photo">
                  <img src={user_pic} alt="Joemy" />
                </div>
              </td>
              <td>Joemy</td>
              <td>09122911792</td>
              <td>jayflores139@gmail.com</td>
              <td>
                <span className="user_status__active user_status">Active</span>
              </td>
              <td>Editor</td>
              <td>
                <button className="btn btn-sm view_btn mr-2"><FaEye/> View</button>
                <button className="btn btn-sm app-primary-btn"><FaPen/> Edit</button>
              </td>
            </tr>
            <tr>
              <td>
                <div className="photo">
                  <img src={user_pic} alt="Joemy" />
                </div>
              </td>
              <td>Joemy</td>
              <td>09122911792</td>
              <td>jayflores139@gmail.com</td>
              <td>
                <span className="user_status__inactive user_status">Inactive</span>
              </td>
              <td>Editor</td>
              <td>
                <button className="btn btn-sm view_btn mr-2"><FaEye/> View</button>
                <button className="btn btn-sm app-primary-btn"><FaPen/> Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </BaseLayout>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(index)
