import Axios from 'axios'
import React from 'react'
import { connect } from 'react-redux'
import {Link} from 'react-router-dom'

export const PaymentLists = ({studentId}) => {
  const [allPaymentBd, setAllPaymentBd] = React.useState([])

  const numText = (num) => {
    switch (num) {
      case 1:
        return num + 'st'
      case 2: 
        return num + 'nd'
      case 3: 
        return num + 'rd'
      default:
        return num + 'th'
    }
  }

  React.useEffect(() => {
    const unsubscribe = (
      Axios.get(`/api/paymentLists/byStudent/${studentId}`)
        .then(res => {
          setAllPaymentBd(state => state = res.data)
        })
        .catch(err => console.log(err))
    )
    return () => unsubscribe
  }, [studentId])

  const className = (dueDate, status) => {
    const now = new Date().toLocaleDateString()
    const dueDateFormat = new Date(dueDate).toLocaleDateString()
    if (status === 'Paid') {
      return 'status-paid-color'
    }
    if (status === 'Cancelled') {
      return 'status-cancelled-color'
    }
    if (dueDateFormat === now) {
      return 'due-color'
    }
  }

  return (
    <div className="table-responsive table_wrapper" style={{boxShadow: 'none'}}>
      <table className="table table-payment-breakdown">
        <thead>
          <tr>
            <th></th>
            <th>Amount</th>
            <th>Due Date</th>
            <th>Date Paid</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allPaymentBd && allPaymentBd.map((item, i) => (
            <tr key={i} 
              className={className(item.dueDate, item.status)}>
              <td>
                <Link className="view-payment" to={`/edit_payment/${item._id}/${numText(i + 1)}`}>
                    {numText(i + 1)} Payment
                </Link>
              </td>
              <td>
                <Link className="view-payment" to={`/edit_payment/${item._id}/${numText(i + 1)}`}>
                    {item.amount} {item.currency}
                </Link>
              </td>
              <td>
                <Link className="view-payment" to={`/edit_payment/${item._id}/${numText(i + 1)}`}>
                    {new Date(item.dueDate).toLocaleDateString()}
                </Link>
              </td>
              <td>
                <Link className="view-payment" to={`/edit_payment/${item._id}/${numText(i + 1)}`}>
                    {!item.datePaid ? '---' : new Date(item.datePaid).toLocaleDateString() }
                </Link>
              </td>
              <td>
                <Link className="view-payment" to={`/edit_payment/${item._id}/${numText(i + 1)}`}>
                    {item.status && item.status}
                </Link>
              </td>
              <td>
                <Link to={`/edit_payment/${item._id}`}
                  className="btn btn-sm app-primary-btn" 
                >Edit</Link>
              </td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PaymentLists))
