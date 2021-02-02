import BaseLayout from 'components/BaseLayout'
import React, {useState, useCallback, useEffect} from 'react'
import { connect, useSelector } from 'react-redux'
import axios from 'axios'
import { useHistory, useParams } from 'react-router-dom'
import BackButton from 'statelessComponent/BackButton'
import { currencies, inputTypeDateValue, studentStatus } from 'helpers'
import Axios from 'axios'

export const StudentEdit = () => {
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
  const [disableSubmitBtn, setDisableSubmitBtn] = useState(false)
  const [depositAmount, setDepositAmount] = useState('0')
  const [depositPaidDate, setDepositPaidDate] = useState('')
  const [currency, setCurrency] = useState('')
  const history = useHistory()
  const {studentID} = useParams()
  const [loading, setLoading] = useState(false)
  const [paymentPlanId, setPaymentPlanId] = useState('')
  const [paymentDateStart, setPaymentDateStart] = useState('')
  const {plans} = useSelector(state => state.planReducer)
  const [paymentPlans, setPaymentPlans] = useState([])

  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setDisableSubmitBtn(true) 
    setFormText('Submitting...') 
    const studentInfo = {firstName, lastName, email, country,}    
    const paymentInfo = {depositAmount, depositPaidDate, paymentStatus, 
                          salesGuy, paymentMethod, contractSigned, joinedDate, 
                          currency, paymentPlanId, paymentDateStart}

    const unsubscribe = axios.post(`/api/student/update/${studentID}`, {studentInfo, paymentInfo})
    unsubscribe.then(res => {
      setFormText('Redirecting...')
      if (res.data) {
        setTimeout(() => {
          history.push('/students')
        }, 300)
      }
    })
    .catch(err => console.log(err))
    return () => unsubscribe
  }, 
  [firstName, lastName, email, country, depositAmount, depositPaidDate, 
    paymentStatus, salesGuy, paymentMethod, contractSigned, joinedDate, 
    currency, history, paymentDateStart, paymentPlanId, studentID])


  useEffect(() => {
    let unsubscribe = false
    axios.get(`/api/student/${studentID}`)
      .then(res => {
        const data = res.data.student
        if (!unsubscribe) {
          setLoading(false)
          setFirstName(data.firstName || '')
          setLastName(data.lastName || '')
          setEmail(data.email || '')
          setCountry(data.country || '')
          setContractSigned(data.paymentInfo.contractSigned || '')
          setSalesGuy(data.paymentInfo.salesGuy || '')
          setPaymentMethod(data.paymentInfo.paymentMethod || '')
          setPaymentStatus(data.paymentInfo.paymentStatus || '')
          setJoinedDate( inputTypeDateValue(data.paymentInfo.joinedDate) || '' )
          setDepositAmount(data.paymentInfo.depositAmount || 0)
          setDepositPaidDate( inputTypeDateValue(data.paymentInfo.depositPaidDate) || '' )
          setCurrency(data.paymentInfo.currency || 'USD')
          setPhone(data.phone || '')
          setPaymentPlanId(data.paymentInfo.paymentPlanId)
          setPaymentDateStart(inputTypeDateValue(data.paymentInfo.paymentDateStart))
        }
      })
      .catch(err => {
        if (!unsubscribe) setLoading(true)
        console.log(err)
      })
      
    return () => {
      unsubscribe = true
    }
  }, [studentID])


  useEffect(() => {
    let unsubscribe = false
    if (plans.length) {
      if (!unsubscribe) setPaymentPlans(plans)
    } else {
      Axios.get(`/api/plan`)
        .then(res => {
          if (!unsubscribe) setPaymentPlans(res.data.plans)
        })
        .catch(err => console.log(err))
    }
    return () => {
      unsubscribe = true
    }
  }, [plans])


  useEffect(() => {
    let unsubscribe = false
    if (firstName === '' || lastName === '' || email === '' || depositAmount === 0 || joinedDate === '' || paymentStatus === '') {
      if (!unsubscribe) setDisableSubmitBtn(true)
    }else {
      if (!unsubscribe) setDisableSubmitBtn(false)
    }
    return () => {
      unsubscribe = true
    }
  }, [firstName, lastName, email, joinedDate, paymentStatus, depositAmount])

  
  if (loading) {
    return (
      <BaseLayout>
        <p>Loading...</p>
      </BaseLayout>
    )
  }


  return (
    <BaseLayout>
      <BackButton text="Back" />
      <h2 className="text-center mt-4 mb-4">Edit Student</h2>

      <div className="StudentCreatePage">
        <form onSubmit={handleSubmit}>

            <div className="col-md-6 m-auto">
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

              </div>
            </div>

            <div className="col-md-6 m-auto">
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
                        <option value=""></option>
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
                  <label>Sales Guy</label>
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


          <div className="text-right col-md-6 m-auto">
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

        </form>
      </div>
    </BaseLayout>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(StudentEdit))
