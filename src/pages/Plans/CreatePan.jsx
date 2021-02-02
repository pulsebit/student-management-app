import Axios from 'axios'
import { currencies, paymentRecurrenceType } from 'helpers'
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

  const [additionalPayment, setAdditionalPayment] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [plusAmount, setPlusAmount] = useState('')
  const [plusCurrency, setPlusCurrency] = useState(currencies[0])
  const [plusQty, setPlusQty] = useState('')
  const [disAbledPlusBtn, setDisAbledPlusBtn] = useState(false)

  const handlePlusPayment = useCallback(() => {
    setAdditionalPayment(state => [...state, {id: state.length + 1, plusAmount, plusCurrency, plusQty,}])
    setPlusAmount('')
    setPlusCurrency(currencies[0])
    setPlusQty('')
    if (resultName !== '') {
      setResultName(state => state = `${state} and ${plusQty} x ${plusAmount} ${plusCurrency}`)
    }
    return () => {}
  }, [plusAmount, plusCurrency, plusQty, resultName])

  const handleDeleteAdditionalPayment = useCallback((e, id) => {
    setAdditionalPayment(state => state.filter(item => item.id !== id))
  }, [])

  const handleSubmit = useCallback((e) => {
    setDisableSubmit(true)
    e.preventDefault()
    const payload = {amount, currency, quantity, recurrence, resultName}
    Axios.post('/api/plan/create', payload)
      .then(res => {
        const data = res.data.plan
        if (data) {
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
    else setResultName('')
    return () => {}
  }, [amount, currency, quantity, recurrence])

  useEffect(() => {
    if (amount === '' || amount === 0 || currency === '' || quantity === '' || recurrence === '') {
      setDisableSubmit(true)
    } else {
      setDisableSubmit(false)
    }
  }, [amount, currency, quantity, recurrence])

  useEffect(() => {
    if (plusAmount === '' || plusCurrency === '' || plusQty === '') {
      setDisAbledPlusBtn(true)
    } else {
      setDisAbledPlusBtn(false)
    }
  }, [plusAmount, plusCurrency, plusQty])

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
              
          {!showForm && (
            <button 
              type="button" 
              className="btn app-primary-btn btn-sm"
              onClick={() => setShowForm(true)}
            >Add More Payment</button>
          )}

          {additionalPayment && additionalPayment.map((item, i) => (
            <div className="lists-of-newly-add-payment" key={i}>
              <span>and {item.plusQty} x {item.plusAmount} {item.plusCurrency}</span>
              <button type="button" onClick={(e) => handleDeleteAdditionalPayment(e, item.id)}>&times;</button>
            </div>
          ))}
          
          {showForm &&  (
            <div className="additional-payment-wrapper">
              <div className="additional-payment">
                <input 
                  className="form-control app-input et" 
                  type="number" 
                  placeholder="Amount"
                  value={plusAmount}
                  onChange={e => setPlusAmount(e.target.value)} 
                />
                <select 
                  className="form-control app-input et" 
                  type="text"
                  value={plusCurrency}
                  onChange={e => setPlusCurrency(e.target.value)} 
                >
                  {currencies && currencies.map((item, i) => (
                    <option value={item} key={i}>{item}</option>
                  ))}
                </select>
                <input 
                  placeholder="Quantity"
                  className="form-control app-input et" 
                  type="number" 
                  value={plusQty}
                  onChange={e => setPlusQty(e.target.value)}
                />
                <button 
                  type="button" 
                  className="btn app-primary-btn et"
                  onClick={handlePlusPayment}
                  disabled={disAbledPlusBtn}
                >&#43;</button>
              </div>
            </div>
          )}

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
