import BaseLayout from 'components/BaseLayout'
import React from 'react'
import { connect } from 'react-redux'
import Axios from 'axios'
import './Notification.css'
import { Link } from 'react-router-dom'

export const Notifications = () => {
  const [notifications, setNotifications] = React.useState(null)

  React.useEffect(() => {
    let unsubscribe = false
    Axios.get('/api/notifications/lists')
      .then(res => {
        if (res.data.length) {
          if (!unsubscribe) setNotifications(res.data)
        }
      })
      .catch(err => console.log(err))
    return () => {
      unsubscribe = true
    }
  }, [])

  return (
    <BaseLayout>
      <h2 className="title">All payment dues</h2>
      <p>All payment dues that is within 7 days will show up here</p>
      
      <div className="table-responsive table_wrapper">
        <table className="table">
          <thead>
            <tr>
            <th>Full Name</th>
            <th>Due Date</th>
            <th>Amount Due</th>
            <th>Status</th>
            <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {notifications && notifications.map((item, i) => (
              <tr key={i}>
                <td>
                  <Name studentId={item.studentId} />
                </td>
                <td>{new Date(item.dueDate).toDateString()}</td>
                <td>
                  <span className="amount">Amount: {item.amount} {item.currency}</span>
                </td>
                <td>
                <span 
                  className={`status 
                            ${item.status === 'Cancelled' && ' cancelled '}
                            ${item.status === 'Pending' && ' pending '}
                            ${item.status === 'Paid' && ' paid '}
                        `}>{item.status}</span>
                </td>
                <td>
                <Link   
                  className="btn app-primary-btn" 
                  to={`/students/${item.studentId}#/edit_payment/${item._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </BaseLayout>
  )
}

const Name = ({studentId}) => {
  const [name, setName] = React.useState('')
  React.useEffect(() => {
    Axios.get(`/api/notifications/student/${studentId}`)
    .then(res => setName(res.data))
    .catch(err => console.log(err))
    return () => {}
  }, [studentId])
  return (
    <span className="name">{name}</span>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
