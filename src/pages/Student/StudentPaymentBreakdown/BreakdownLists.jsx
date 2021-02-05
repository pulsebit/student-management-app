import React from 'react'
import { connect, useSelector } from 'react-redux'
import {Link} from 'react-router-dom'
import Axios from 'axios'

export const PaymentLists = ({studentId, paymentPlanId}) => {
  const [allPaymentBd, setAllPaymentBd] = React.useState(null)
  const {paymentLists} = useSelector(state => state.paymentListsReducer) 

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

  const handleFilterLists = React.useCallback((value) => {
    let unsubscribe = false
    if (value === 'all') {
      Axios.get(`/api/paymentLists/byStudent/${studentId}/planId/${paymentPlanId}`)
        .then(res => {
          if (res.data) {
            if (!unsubscribe) {
              setAllPaymentBd(res.data)
            }
          }
        })
        .catch(err => console.log(err))
    }
    if (value === 'custom') {
      Axios.get(`/api/paymentLists/byStudent/${studentId}/planId/${paymentPlanId}/?category=custom`)
        .then(res => {
          if (res.data) {
            if (!unsubscribe) {
              setAllPaymentBd(res.data)
            }
          }
        })
        .catch(err => console.log(err))
    }
    return () => {
      unsubscribe = true
    }
  }, [paymentPlanId, studentId])

  React.useEffect(() => {
    let unsubscribe = false
    if (paymentLists.data && paymentLists.data.length) {
      if (!unsubscribe) {
        setAllPaymentBd(paymentLists.data)
      }
    } else {
      Axios.get(`/api/paymentLists/byStudent/${studentId}/planId/${paymentPlanId}`)
        .then(res => {
          if (res.data && res.data.length) {
            if (!unsubscribe) {
              setAllPaymentBd(res.data)
            }
          }
        })
        .catch(err => console.log(err))
    }
    return () => {
      unsubscribe = true
    }
  }, [studentId, paymentPlanId, paymentLists])

  if (allPaymentBd && allPaymentBd.length === 0) {
    return (
      <>
        <div className="paymentlist-action-wrapper">
          <button className="paymentlist-action" onClick={() => handleFilterLists('all')}>All</button>
          <button className="paymentlist-action" onClick={() => handleFilterLists('custom')}>Custom</button>
          <Link className="paymentlist-action" to={`/new_payment/${paymentPlanId}`}>Add new payment</Link>
        </div>

        <div className="table-responsive table_wrapper mt-4" style={{boxShadow: 'none', border: '1px solid #f2f3f3'}}>No Record Result</div>
      </>
    )
  }

  // /new_payment/:paymentPlanId

  return (
    <>
      <div className="paymentlist-action-wrapper">
        <button className="paymentlist-action" onClick={() => handleFilterLists('all')}>All</button>
        <button className="paymentlist-action" onClick={() => handleFilterLists('custom')}>Custom</button>
        <Link className="paymentlist-action" to={`/new_payment/${paymentPlanId}`}>Add new payment</Link>
      </div>

      <div className="table-responsive table_wrapper p-0 mt-4" style={{boxShadow: 'none', border: '1px solid #f2f3f3'}}>
        <table className="table table-payment-breakdown">
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Due Date</th>
              <th>Date Paid</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {allPaymentBd && allPaymentBd.map((item, i) => (
              <tr key={i}>
                <td>
                  <Link className="view-payment" to={`/edit_payment/${item._id}`}>
                      {numText(i + 1)} Payment
                  </Link>
                </td>
                <td>
                  <Link className="view-payment" to={`/edit_payment/${item._id}`}>
                      {item.amount} {item.currency}
                  </Link>
                </td>
                <td>
                  <Link className="view-payment" to={`/edit_payment/${item._id}`}>
                      {!item.dueDate ? '---' : new Date(item.dueDate).toLocaleDateString()}
                  </Link>
                </td>
                <td>
                  <Link className="view-payment" to={`/edit_payment/${item._id}`}>
                      {!item.datePaid ? '---' : new Date(item.datePaid).toLocaleDateString() }
                  </Link>
                </td>
                <td>
                  <Link className="view-payment" to={`/edit_payment/${item._id}`}>
                      {item.status && item.status}
                  </Link>
                </td>
                <td>
                  <Link to={`/edit_payment/${item._id}`}
                    className="btn btn-sm app-primary-btn" 
                  >edit</Link>
                  {item.category && item.category === 'custom' && (
                    <button className="btn btn-sm btn-danger ml-1">delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(PaymentLists))
