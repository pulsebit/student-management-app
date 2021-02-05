import Axios from 'axios'
import { currencies } from 'helpers'
import React, {useState, useEffect, useCallback} from 'react'
import { connect, useSelector, useDispatch } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { PlanName } from '../StudentPlans/PlanName'
import RightPanelSlide from '../StudentPlans/RightPanelSlide'

export const CreatePayment = ({studentId}) => {
  const [amount, setAmount] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [datePaid, setDatePaid] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const {plans} = useSelector(state => state.planReducer)
  // const {paymentLists} = useSelector(state => state.paymentListsReducer)
  const history = useHistory()
  const dispatch = useDispatch()
  const {paymentPlanId} = useParams()

  const handleSubmit = useCallback((e) => {
    e.preventDefault()  
    let unsubscribe = false
    const paymentData = {
      amount, 
      currency, 
      datePaid, 
      notes, 
      status, 
      category: 'custom', 
      paymentPlanId: paymentPlanId
    }
    Axios.post('/api/paymentLists/new-additional-payment', {paymentData, studentId})
      .then(res => {
        if (res.data) {
          dispatch({
            type: 'LOADING_PAYMENT_LISTS',
            payload: {data: true}
          })
          Axios.get(`/api/student/student-plan/${studentId}/${paymentPlanId}`)
            .then(res => {
              Axios.get(`/api/paymentLists/byStudent/${studentId}/planId/${paymentPlanId}`)
                .then(res2 => {
                  if (!unsubscribe) {
                    dispatch({
                      type: 'LOADING_PAYMENT_LISTS',
                      payload: {data: false}
                    })
                    dispatch({
                      type: 'ALL_PAYMENT_LISTS',
                      payload: {
                        loading: false,
                        data: res2.data,
                        paymentPlanId: paymentPlanId,
                        status: res.data.status,
                      }
                    })
                    setTimeout(() => {
                      history.replace('/')
                    }, 300)
                  }
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err))
    return () => {
      unsubscribe = true
    }
  },[amount, currency, datePaid, notes, status, studentId, history, paymentPlanId, dispatch])

  useEffect(() => {
    let unsubscribe = false
    Axios.get(`/api/plan/${paymentPlanId}`)
      .then(({data}) => {
        if (!unsubscribe) {
          setAmount(data.amount)
          setCurrency(data.currency)
        }
      })
      .catch(err => console.log(err))
    return () => {
      unsubscribe = true
    }
  }, [plans, paymentPlanId])

  const title = () => {
    return (
      <>
        Add Payment to <span style={{color: '#358e49'}}><PlanName planId={paymentPlanId} /></span> Plan
      </>
    )
  }

  return (
    <RightPanelSlide title={title()}>
      <div className="table_wrapper table-responsive p-0" style={{boxShadow: 'none'}}>
        <form onSubmit={handleSubmit}>
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
    </RightPanelSlide>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(CreatePayment)
