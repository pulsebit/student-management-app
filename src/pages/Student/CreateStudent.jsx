import BaseLayout from 'components/BaseLayout'
import React, {useState, useCallback, useEffect} from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { useHistory } from 'react-router-dom'
import BackButton from 'statelessComponent/BackButton'
import { currencies, inputTypeDateValue, studentStatus } from 'helpers'
import { RRule, RRuleSet } from 'rrule'

export const CreateStudent = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [country, setCountry] = useState('')
  const [contractSigned, setContractSigned] = useState('')
  const [salesGuy, setSalesGuy] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('')  
  const [joinedDate, setJoinedDate] = useState('')
  const [phone, setPhone] = useState('') 
  const [formBtnText, setFormText] = useState('Submit')
  const [paymentPlans, setPaymentPlans] = useState([])
  const [paymentPlanId, setPaymentPlanId] = useState('')
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false)
  const [depositAmount, setDepositAmount] = useState(0)
  const [pipeline, setPipeline] = useState('')
  const [depositPaidDate, setDepositPaidDate] = useState('')
  const [paymentDateStart, setPaymentDateStart] = useState('')
  const [currency, setCurrency] = useState('USD')
  const history = useHistory()
  const [singlePlan, setSinglePlan] = useState({})
  const rruleSet = new RRuleSet()

  const scheduleDateLists = useCallback(() => {
    const yearUTC = new Date(paymentDateStart).getUTCFullYear()
    const dayUTC = new Date(paymentDateStart).getUTCDate()
    const monthUTC = new Date(paymentDateStart).getUTCMonth()
    let options = {freq: RRule.WEEKLY}
    
    if (singlePlan.recurrence === 'Weekly')
      options = {freq: RRule.WEEKLY}
    if (singlePlan.recurrence === 'Fortnightly')
      options = {freq: RRule.WEEKLY, interval: 2}
    if (singlePlan.recurrence === 'Monthly')
      options = {freq: RRule.MONTHLY}
    
    rruleSet.rrule(new RRule({
      ...options,
      count: singlePlan.quantity || 0,
      dtstart: new Date(Date.UTC(yearUTC, monthUTC, dayUTC, 0, 0))
    }))
    return rruleSet.all().map(date => {
      return {dueDate: inputTypeDateValue(date)}
    })
  }, [paymentDateStart, rruleSet, singlePlan.quantity, singlePlan.recurrence])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setDisableSubmitBtn(true) 
    setFormText('Submitting...') 
    const studentInfo = {firstName, lastName, email, country, phone}
    const paymentInfo = {depositAmount, depositPaidDate, paymentStatus, 
                          salesGuy, paymentMethod, contractSigned, joinedDate, 
                          currency, paymentPlanId, paymentDateStart} 
    const paymentBreakdown = scheduleDateLists().map((item) => ({
      ...item, amount: singlePlan.amount, currency: singlePlan.currency, status: 'Pending'
    }))
    axios.post('/api/student/create', {studentInfo, paymentInfo, paymentBreakdown})
      .then(res => {
        setFormText('Redirecting...')
        if (res.data) {
          setTimeout(() => {
            history.push(`/students/${res.data.student._id}`)
          }, 300)
        }
      })
      .catch(err => console.log(err))
  }, 
  [firstName, lastName, email, country, depositAmount, depositPaidDate, 
    paymentStatus, salesGuy, paymentMethod, contractSigned, joinedDate, 
    currency,paymentDateStart, history, paymentPlanId, scheduleDateLists, 
    singlePlan.amount, singlePlan.currency, phone])


  useEffect(() => {
    let unsubscribe = false
    axios.get('/api/plan')
      .then(res => {
        if(!unsubscribe) setPaymentPlans(res.data.plans)
      })
      .catch(err => console.log(err))
    return () => {
      unsubscribe = true
    }
  }, [])


  useEffect(() => {
    let unmount = false
    if (paymentPlanId !== '') {
      axios.get(`/api/plan/${paymentPlanId}`)
        .then(res => {
          if (!unmount) setSinglePlan(res.data)
        })
        .catch(err => console.log(err))
    }
    return () => {
      unmount = true
    }
  }, [paymentPlanId])


  useEffect(() => {
    if (
      firstName === '' || lastName === '' || 
      email === '' || paymentPlanId === '' || 
      depositAmount === 0 || paymentDateStart === '' || 
      joinedDate === '' || paymentStatus === ''
    ) {
      setDisableSubmitBtn(true)
    } else {
      setDisableSubmitBtn(false)
    }
  }, [firstName, lastName, email, paymentPlanId, 
    joinedDate, paymentStatus, depositAmount, paymentDateStart])


  return (
    <BaseLayout>
      <BackButton text="Back" />
      <h2 className="mt-4 mb-4">Add Student</h2>

      <div className="StudentCreatePage">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
                <div className="PaymentInfo">
                  <h4 style={{marginBottom: '25px'}}>Payment Info</h4>

                  <div className="form-group">
                    <div className="row">
                      <div className="col-md-4">
                        <label>Deposit</label>
                        <input type="number" placeholder="amount" className="form-control form-control-lg app-input"
                          value={depositAmount}
                          onChange={e => setDepositAmount(e.target.value)}
                        />
                      </div>
                      <div className="col-md-4">
                        <label>Currency</label>
                        <select className="form-control form-control-lg app-input"
                          value={currency}
                          onChange={e => setCurrency(e.target.value)}
                        >
                          <option value=""></option>
                          {currencies && currencies.map((item, i) => (
                            <option value={item} key={i}>{item}</option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label>Date Paid</label>
                        <input type="date" className="form-control form-control-lg app-input"
                          value={depositPaidDate}
                          onChange={e => setDepositPaidDate(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Payment Plan</label>
                        <select className="form-control form-control-lg app-input"
                          value={paymentPlanId}
                          onChange={e => setPaymentPlanId(e.target.value)}
                        >
                          <option value="">--Select Payment Plan--</option>
                          {paymentPlans && paymentPlans.map((item, i) => (
                            <option key={i} value={item._id}>{item.resultName}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label>Payment Date Start</label>
                        <input type="date" className="form-control form-control-lg app-input"
                          value={paymentDateStart}
                          onChange={e => setPaymentDateStart(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Signed Contract</label>
                    <input type="text" className="form-control form-control-lg app-input"
                      required
                      value={contractSigned} 
                      onChange={e => setContractSigned(e.target.value)} 
                    />
                  </div>

                  <div className="form-group">
                    <label>Sales Rep</label>
                    <input type="text" className="form-control form-control-lg app-input"
                      value={salesGuy} 
                      onChange={e => setSalesGuy(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Method</label>
                    <input type="text" className="form-control form-control-lg app-input"
                      value={paymentMethod} 
                      onChange={e => setPaymentMethod(e.target.value)} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Payment Status</label>
                    <select className="form-control form-control-lg app-input"
                      required
                      value={paymentStatus} 
                      onChange={e => setPaymentStatus(e.target.value)} 
                    >
                      <option value=""></option>
                      {studentStatus && studentStatus.map((sts, i) => (
                        <option value={sts.name} key={i}>{sts.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Joined Date</label>
                    <input type="date" className="form-control form-control-lg app-input"
                      value={joinedDate}
                      onChange={e => setJoinedDate(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              
            <div className="col-md-6">
              <div className="StudentInfo">
                <h4 style={{marginBottom: '25px'}}>Student Info</h4>

                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>First Name</label>
                      <input className="form-control form-control-lg app-input" type="text"
                        required
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label>Last Name</label>
                      <input className="form-control form-control-lg app-input" type="text"
                        required
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                      />
                    </div>
                  </div>
                </div>  

                <div className="form-group">
                  <label>Email</label>
                  <input className="form-control form-control-lg app-input" type="email"
                    required
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>
                  <input className="form-control form-control-lg app-input" type="tel"
                    required
                    value={phone} 
                    onChange={e => setPhone(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Country (optional)</label>
                  <input className="form-control form-control-lg app-input" type="text" 
                    value={country} 
                    onChange={e => setCountry(e.target.value)} 
                  />
                </div>

                <div className="form-group">
                  <label>Pipeline</label>
                  <input className="form-control form-control-lg app-input" type="text" 
                    value={pipeline} 
                    onChange={e => setPipeline(e.target.value)} 
                  />
                </div>

              </div>
              <div className="text-right">
                <div className="pt-2 pb-2 create-student-form-btn-wrapper">
                  <button 
                    type="submit" 
                    className="btn app-primary-btn" 
                    disabled={disableSubmitBtn}
                    >
                      {formBtnText}
                  </button>
                </div>
              </div>
            </div>
          
          </div>

        </form>
      </div>
    </BaseLayout>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(CreateStudent))
