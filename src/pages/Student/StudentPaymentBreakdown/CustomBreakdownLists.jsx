import React from 'react'
import { connect, useSelector } from 'react-redux'
import {Link} from 'react-router-dom'

export const CustomBreakdownLists = ({studentId}) => {
  const [allPaymentBd, setAllPaymentBd] = React.useState(null)
  const {paymentLists} = useSelector(state => state.paymentListsReducer)

  React.useEffect(() => {
    if (!paymentLists) {
      setAllPaymentBd([])
    } else {
      const newPaymentLists = []
      paymentLists.forEach(item => {
        if (item.category === 'custom') {
          newPaymentLists.push(item)
        }
      })
      setAllPaymentBd(newPaymentLists)
    }
    return () => {}
  }, [studentId, paymentLists])

  if (allPaymentBd === null) {
    return (
      <div className="table-responsive table_wrapper">Loading...</div>
    )
  }

  if (allPaymentBd && allPaymentBd.length === 0) {
    return (
      <div className="table-responsive table_wrapper">No Record Result</div>
    )
  }

  return (
    <div className="table-responsive table_wrapper">
      <table className="table table-payment-breakdown">
        <thead>
          <tr>
            <th>Amount</th>
            <th>Date Paid</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {allPaymentBd && allPaymentBd.map((item, i) => (
            <tr key={i}>
              <td>
                <Link className="view-payment" to={`/edit_payment/${item._id}`}>
                    {item.amount} {item.currency}
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
                >Edit</Link>
              </td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CustomBreakdownLists))
