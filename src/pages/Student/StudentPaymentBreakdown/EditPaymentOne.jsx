import Axios from 'axios'
import { currencies, inputTypeDateValue } from 'helpers'
import { syncPaymentLists } from 'helpers/syncStore'
import React, {useState, useCallback, useEffect} from 'react'
import { connect, useSelector} from 'react-redux'
import { useHistory, useParams, Link } from 'react-router-dom'
import { PlanName } from '../StudentPlans/PlanName'
import RightPanelSlide from '../StudentPlans/RightPanelSlide'
import './EditPaymentOne.css'

export const EditPaymentOne = ({studentId}) => {
  const [amount, setAmount] = useState(0)
  const [currency, setCurrency] = useState('USD')
  const [dueDate, setDueDate] = useState('')
  const [datePaid, setDatePaid] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState('')
  const [submitBtnText, setSubmitBtnText] = useState('update')
  const [disableBtn, setDisableBtn] = useState(false)
  const {paymentId} = useParams()
  const history= useHistory()
  const [loading, setLoading] = useState(false)
  const {user} = useSelector(state => state.auth.isAuthenticated)
  const [paymentList, setPaymentLists] = useState({})

  const handleUpdate = useCallback((e) => {
    e.preventDefault()
    let unmount = false
    if (!unmount) setSubmitBtnText('Submitting...')
    if (!unmount) setDisableBtn(true)
    const payload = {notes, paymentId, userId: user.id, amount, currency, dueDate, status, datePaid}
    Axios.post(`/api/paymentLists/update`, payload)
      .then(res => { 
        setTimeout(() => {
          syncPaymentLists(studentId, res.data.paymentPlanId)
          history.replace('/')
        }, 200)
        if (!unmount) setDisableBtn(false)
      })
      .catch(err => {
        if (!unmount) setDisableBtn(false)
        console.log(err)
      })
    return () => {
      unmount = true
    }
  }, [history, paymentId, currency, datePaid, dueDate, notes, status, amount, user.id, studentId])

  const handleSetStatus = useCallback((value) => {
    setStatus(value)
    if (value === 'Cancelled') {
      setDatePaid('')
    } 
  }, [])

  useEffect(() => {
    let unsubscribe = false
    if (!unsubscribe) setLoading(true)
    Axios.get(`/api/paymentLists/byPaymentId/${paymentId}`)
      .then(res => {
        if (res.data) {
          if (!unsubscribe) {
            setLoading(false)
            setAmount(res.data.amount)
            setCurrency(res.data.currency)
            setDueDate(state => state = inputTypeDateValue(res.data.dueDate))
            setDatePaid(state => state = inputTypeDateValue(res.data.datePaid))
            setStatus(res.data.status)
            setNotes(res.data.notes || '')
          }
        }
      })
      .catch(err => {
        if (!unsubscribe) setLoading(true)
        console.log(err)
      })
    return () => {
      unsubscribe = true
    }
  }, [paymentId])

  useEffect(() => {
    let unsubscribe = false
    Axios.get(`/api/paymentLists/${paymentId}`)
      .then(res => {
        if (!unsubscribe) setPaymentLists(res.data)
      })
      .catch(err => console.log(err))
    return () => {
      unsubscribe = true
    }
  }, [paymentId])

  if (loading) {
    return (
      <RightPanelSlide title="Loading...">
      </RightPanelSlide>
    )
  }

  const title = () => {
    return (
      <>
        Edit Payment from <span style={{color: 'rgb(53 142 73)'}}><PlanName planId={paymentList && paymentList.paymentPlanId} /></span> Plan
      </>
    )
  }

  return (
    <RightPanelSlide title={title()}>
      <div className="table_wrapper table-responsive" style={{boxShadow: 'none'}}>
        <form onSubmit={handleUpdate}>
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
                <th className="text-right">due date</th>
                <th>
                  <input type="date" className="form-control app-input"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)} />
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
                    onChange={e => handleSetStatus(e.target.value)} >
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
                  <Link type="button" className="btn btn-sm app-input mr-2"
                    to='/' >cancel</Link>
                  <button disabled={disableBtn} type="submit" className="btn btn-sm app-primary-btn">{submitBtnText}</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditPaymentOne)
