import React from 'react'
import { connect, useSelector } from 'react-redux'
import RightPanelSlide from './RightPanelSlide'
import Axios from 'axios'
import { currencies } from 'helpers'
import { useHistory } from 'react-router-dom'

export const CreateAndHoldCurrentPlan = ({studentId, currentPaymentPlanId}) => {
  const {plans} = useSelector(state => state.planReducer)
  const [allPlans, setAllPlans] = React.useState([])
  const [newPlan, setNewPlan] = React.useState('')
  const [deposit, setDeposit] = React.useState(0)  
  const [depositDatePaid, setDepositDatePaid] = React.useState('')  
  const [paymentDateStart, setPaymentDateStart] = React.useState('')  
  const [disAbleSubmitBtn, setDisAbleSubmitBtn] = React.useState(false)
  const [currency, setCurrency] = React.useState('USD')
  const history = useHistory()

  const handleSubmit = React.useCallback(() => {
    const payload = {
      depositAmount: deposit, 
      currency, 
      depositPaidDate: depositDatePaid, 
      paymentDateStart, 
      paymentPlanId: newPlan,
    }
    Axios.post(`/api/student/add_new_and_hold_the_current_plan/${studentId}/${currentPaymentPlanId}`, payload)
      .then(res => {
        console.log(res.data)
      })
      .catch(err => console.log(err))
    // history.push('/')
  }, [deposit, currency, depositDatePaid, paymentDateStart, newPlan, studentId, currentPaymentPlanId])

  React.useEffect(() => {
    let unsubscribe = false
    if (plans && plans.length) {
      if (!unsubscribe) setAllPlans(plans)
    } else {
      Axios.get('/api/plan')
        .then(res => {
          if (!unsubscribe) setAllPlans(res.data.plans)
        })
        .catch(err => console.log(err))
    }
    return () => {
      unsubscribe = true
    }
  }, [plans])

  React.useEffect(() => {
    if (newPlan === '' || deposit === '' || deposit === 0 || depositDatePaid === '' || paymentDateStart === '') {
      setDisAbleSubmitBtn(true)
    } else {
      setDisAbleSubmitBtn(false)
    }
  }, [newPlan, deposit, depositDatePaid, paymentDateStart])

  return (
    <RightPanelSlide title="Add New And Hold The Current Plan">
        <div className="table-responsive table_wrapper" style={{boxShadow: 'none', padding: 0}}>
          <table className="table">
            <thead>
              <tr>
                <th>Current Plan</th>
                <th>1500 USD × 3 Monthly</th>
              </tr>
              <tr>
                <th>New Plan</th>
                <th>
                  <select className="form-control app-input"
                    value={newPlan}
                    onChange={e => setNewPlan(e.target.value)}
                  >
                    <option value="">--Select Plan--</option>
                    {allPlans && allPlans.map((item, key) => (
                      <option key={key} value={item._id}>{item.resultName}</option>
                    ))}
                  </select>
                </th>
              </tr>
              <tr>
                <th>Deposit</th>
                <th>
                  <div className="d-flex">
                    <input type="number" className="form-control app-input mr-3"
                      value={deposit}
                      onChange={e => setDeposit(e.target.value)}
                    />
                    <select className="form-control app-input"
                      value={currency}
                      onChange={e => setCurrency(e.target.value)}
                    >
                      {currencies && currencies.map((item, key) => (
                        <option value={item} key={key}>{item}</option>
                      ))}
                    </select>
                  </div>
                </th>
              </tr>
              <tr>
                <th>Deposit Paid Date</th>
                <th>
                  <input type="date" className="form-control app-input"
                    value={depositDatePaid}
                    onChange={e => setDepositDatePaid(e.target.value)}
                  />
                </th>
              </tr>
              <tr>
                <th>Payment Date Start</th>
                <th>
                  <input type="date" className="form-control app-input"
                    value={paymentDateStart}
                    onChange={e => setPaymentDateStart(e.target.value)}
                  />
                </th>
              </tr>
              <tr>
                <th></th>
                <th>
                  <button 
                    disabled={disAbleSubmitBtn}
                    className="btn app-primary-btn" 
                    onClick={handleSubmit}>Submit</button>
                </th>
              </tr>
            </thead>
          </table>
        </div> 
    </RightPanelSlide>
  )
}

export default connect()(CreateAndHoldCurrentPlan)
