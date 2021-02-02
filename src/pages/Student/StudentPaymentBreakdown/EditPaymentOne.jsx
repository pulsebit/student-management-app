import Axios from 'axios'
import { currencies, inputTypeDateValue } from 'helpers'
import React, {useState, useCallback, useEffect} from 'react'
import { connect, useDispatch, useSelector} from 'react-redux'
import { useHistory, useParams, Link } from 'react-router-dom'
import './EditPaymentOne.css'

export const EditPaymentOne = ({studentId, location}) => {
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
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const {user} = useSelector(state => state.auth.isAuthenticated)
  const [isCustomAdd, setIsCustomAdd] = useState(false)

  const handleUpdate = useCallback((e) => {
    e.preventDefault()
    let unmount = false
    if (!unmount) setSubmitBtnText('Submitting...')
    if (!unmount) setDisableBtn(true)
    const payload = {notes, paymentId, userId: user.id, amount, currency, dueDate, status, datePaid}
    Axios.post(`/api/paymentLists/update`, payload)
      .then(res => { 
        setTimeout(() => {
          dispatch({
            type: 'ALL_BD_PAYMENT',
            payload: {
              data: res.data
            }
          })
          history.push('/')
        }, 400)
        if (!unmount) setDisableBtn(false)
      })
      .catch(err => {
        if (!unmount) setDisableBtn(false)
        console.log(err)
      })
    return () => {
      unmount = true
    }
  }, [history, paymentId, currency, datePaid, dueDate, notes, status, amount, dispatch, user.id])

  useEffect(() => {
    const unsubscribe = () => {
      setLoading(true)
      Axios.get(`/api/paymentLists/byPaymentId/${paymentId}`)
        .then(res => {
          if (res.data) {
            setLoading(false)
            setAmount(res.data.amount)
            setCurrency(res.data.currency)
            setDueDate(state => state = inputTypeDateValue(res.data.dueDate))
            setDatePaid(state => state = inputTypeDateValue(res.data.datePaid))
            setStatus(res.data.status)
            setNotes(res.data.notes || '')
            if (res.data.category === 'custom') {
              setIsCustomAdd(true)
            }
          }
        })
        .catch(err => {
          setLoading(true)
          console.log(err)
        })
    }
    unsubscribe()
    return () => {}
  }, [paymentId])

  if (loading) {
    return (
      <div className="m-auto col-md-6">
        <div className="table_wrapper table-responsive pt-3 pb-3">
          <span>Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="m-auto col-md-6">
      <div className="table_wrapper table-responsive">
        <form onSubmit={handleUpdate}>
          <h4 className="text-center mb-3 mt-3">Edit Payment</h4>
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
              {!isCustomAdd && (
                <tr>
                  <th className="text-right">due date</th>
                  <th>
                    <input type="date" className="form-control app-input"
                      value={dueDate}
                      required
                      onChange={e => setDueDate(e.target.value)} />
                  </th>
                </tr>
              )}
              <tr>
                <th className="text-right">date paid</th>
                <th>
                  <input type="date" className="form-control app-input"
                    value={datePaid}
                    required
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
                  <Link type="button" className="btn btn-sm app-input mr-2"
                    to='/' >cancel</Link>
                  <button disabled={disableBtn} type="submit" className="btn btn-sm app-primary-btn">{submitBtnText}</button>
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
export default connect(mapStateToProps, mapDispatchToProps)(EditPaymentOne)
