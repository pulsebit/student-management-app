import Axios from 'axios'
import { currencies } from 'helpers'
import React, {useState, useEffect, useCallback} from 'react'
import { connect, useSelector } from 'react-redux'
import { useHistory } from 'react-router-dom'

export const CreatePayment = ({paymentPlanId, studentId}) => {
  const [amount, setAmount] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [datePaid, setDatePaid] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const {plans} = useSelector(state => state.planReducer)
  const history = useHistory()

  const handleSubmit = useCallback((e) => {
    e.preventDefault()  
    const paymentData = {amount, currency, datePaid, notes, status, category: 'custom'}
    Axios.post('/api/paymentLists/new-additional-payment', {paymentData, studentId})
      .then(res => {
        if (res.data) {
          setTimeout(() => {
            history.push('/custom_payment_lists')
          }, 300)
        }
      })
      .catch(err => console.log(err))
  },[amount, currency, datePaid, notes, status, studentId, history])

  useEffect(() => {
    let unsubscribe = false
    if (plans.length) {
      const planOne = plans.find(item => item._id === paymentPlanId)
      if (!unsubscribe) {
        setAmount(planOne.amount)
        setCurrency(planOne.currency)
      }
    } else {
      Axios.get(`/api/plan/${paymentPlanId}`)
        .then(({data}) => {
          if (!unsubscribe) {
            setAmount(data.amount)
            setCurrency(data.currency)
          }
        })
        .catch(err => console.log(err))
    }
    return () => {
      unsubscribe = true
    }
  }, [plans, paymentPlanId])

  return (
    <div className="m-auto col-md-6">
      <div className="table_wrapper table-responsive">
        <form onSubmit={handleSubmit}>
          <h4 className="text-center mb-3 mt-3">New Payment</h4>
          <table className="table table-form">
            <thead>
              <tr>
                <th className="text-right">amount</th>
                <th>
                  <input type="number" className="form-control app-input" 
                    value={amount}
                    required
                    onChange={e => setAmount(e.target.value)} />
                </th>
              </tr>
              <tr>
                <th className="text-right">currency</th>
                <th>
                  <select className="form-control app-input"
                    value={currency}
                    required
                    onChange={e => setCurrency(e.target.value)} >
                    <option value=""></option>
                    {currencies && currencies.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </th>
              </tr>
              <tr>
                <th className="text-right">date paid</th>
                <th>
                  <input type="date" className="form-control app-input"
                    value={datePaid}
                    onChange={e => setDatePaid(e.target.value)} />
                </th>
              </tr>
              <tr>
                <th className="text-right">status</th>
                <th>
                  <select className="form-control app-input"
                    value={status}
                    required
                    onChange={e => setStatus(e.target.value)} >
                    <option value=""></option>
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </th>
              </tr>
              <tr>
                <th className="text-right">notes</th>
                <th>
                  <textarea className="form-control app-input" cols="30" rows="5" 
                    value={notes}
                    onChange={e => setNotes(e.target.value)} />
                </th>
              </tr>
              <tr>
                <th></th>
                <th>
                  <button type="submit" className="btn btn-sm app-primary-btn">Submit</button>
                </th>
              </tr>
            </thead>
          </table>
        </form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePayment)
