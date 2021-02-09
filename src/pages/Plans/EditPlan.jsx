import Axios from 'axios'
import { currencies, paymentRecurrenceType } from 'helpers'
import { syncAllPlans } from 'helpers/syncStore'
import React, {useState, useCallback, useEffect} from 'react'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import BackButton from 'statelessComponent/BackButton'
import './CreatePlan.css'

export const EditPlan = () => {
  const [amount, setAmount] = useState(0)
  const [currency, setCurrency] = useState(currencies[0])
  const [quantity, setQuantity] = useState('')
  const [recurrence, setRecurrence] = useState(paymentRecurrenceType[0])
  const [resultName, setResultName] = useState('')
  const history = useHistory()
  const [disabledSubmit, setDisableSubmit] = useState(false)
  const {planId} = useParams()

  const handleSubmit = useCallback((e) => {
    setDisableSubmit(true)
    e.preventDefault()
    const payload = {amount, currency, quantity, recurrence, resultName}
    const unsubscribe = Axios.put(`/api/plan/update/${planId}`, {data: payload})
      unsubscribe.then(res => {
        const updatedPlan = res.data
        if (updatedPlan) {
          syncAllPlans()
          setTimeout(() => {
            history.push('/plans')
          }, 300)
        }
      })
      unsubscribe.catch(err => console.log(err))
    return () => unsubscribe
  }, [amount, currency, quantity, recurrence, resultName, history, planId])

  useEffect(() => {
    if (amount !== '' && quantity !== '') 
      setResultName(`${amount} ${currency} × ${quantity} ${recurrence}`)
    else setResultName('')
    return () => {}
  }, [amount, currency, quantity, recurrence])

  useEffect(() => {
    if (amount === '' || currency === '' || quantity === '' || recurrence === '') 
      setDisableSubmit(true)
    else setDisableSubmit(false)
  }, [amount, currency, quantity, recurrence])

  useEffect(() => {
    const unsubscribe = Axios.get(`/api/plan/${planId}`)
      .then(res => {
        const plan = res.data
        setAmount(plan.amount)
        setCurrency(plan.currency)
        setQuantity(plan.quantity)
        setRecurrence(plan.recurrence)
        setResultName(plan.resultName)
      })
      .catch(err => console.log(err))
      return () => unsubscribe
  }, [planId])

  return (
    <div>
      <BackButton text="Back" />
      
      <div className="mb-5"></div>

      <div className="m-auto create_plan_form_wrapper">
        <h4 className="text-center mb-5">Create Plan</h4>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="row">
              <div className="col-md-8">
                <label>Amount</label>
                <input 
                  type="number" 
                  className="form-control app-input" 
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <label>Currency</label>
                <select 
                  className="form-control app-input"
                  value={currency}
                  onChange={e => setCurrency(e.target.value)}
                >
                  {currencies && currencies.map((item, i) => (
                    <option value={item} key={i}>{item}</option>
                  ))}
                </select>
              </div>
            </div>
            
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input 
              type="number" 
              className="form-control app-input"
              value={quantity}
              onChange={e => setQuantity(e.target.value)} 
            />
          </div>
          <div className="form-group">
            <label>Recurrence</label>
            <select 
              className="form-control app-input"
              value={recurrence}
              onChange={e => setRecurrence(e.target.value)}
            >
              {paymentRecurrenceType && paymentRecurrenceType.map((item, i) => (
                <option value={item} key={i}>{item}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Name</label>
            <input 
              className="form-control app-input" 
              type="text" 
              value={resultName}
              onChange={e => setResultName(e.target.value)}
            />
          </div>
          <div className="text-right">
            <button 
              type="submit" 
              className="btn app-primary-btn"
               disabled={disabledSubmit}
            >Update</button>
          </div>
        </form>
      </div>

    </div>
  )
}

const mapStateToProps = (state) => ({}) 
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(EditPlan))
