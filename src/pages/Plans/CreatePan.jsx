import Axios from 'axios'
import { currencies, paymentRecurrenceType } from 'helpers'
import { syncAllPlans } from 'helpers/syncStore'
import React, {useState, useCallback, useEffect} from 'react'
import { connect } from 'react-redux'
import { useHistory } from 'react-router-dom'
import BackButton from 'statelessComponent/BackButton'
import './CreatePlan.css'

export const CreatePan = () => {
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState(currencies[0])
  const [quantity, setQuantity] = useState('')
  const [recurrence, setRecurrence] = useState(paymentRecurrenceType[0])
  const [resultName, setResultName] = useState('')
  const history = useHistory()
  const [disabledSubmit, setDisableSubmit] = useState(false)

  const handleSubmit = useCallback((e) => {
    setDisableSubmit(true)
    e.preventDefault()
    const payload = {amount, currency, quantity, recurrence, resultName}
    console.log('payload', payload)
    Axios.post('/api/plan/create', payload)
      .then(res => {
        const data = res.data.plan
        if (data) {
          syncAllPlans()
          setTimeout(() => {
            history.push('/plans')
          }, 300)
        }
      })
      .catch(err => console.log(err))
    return () => {}
  }, [amount, currency, quantity, recurrence, resultName, history])

  useEffect(() => {
    if (amount !== '' && quantity !== '') 
      setResultName(`${amount} ${currency} × ${quantity} ${recurrence}`)
    return () => {}
  }, [amount, currency, quantity, recurrence])

  useEffect(() => {
    if (amount === '' || amount === 0 || currency === '' || quantity === '' || recurrence === '') {
      setDisableSubmit(true)
    } else {
      setDisableSubmit(false)
    }
  }, [amount, currency, quantity, recurrence])


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
            >Submit</button>
          </div>
        </form>
      </div>

    </div>
  )
}

const mapStateToProps = (state) => ({}) 
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CreatePan))
