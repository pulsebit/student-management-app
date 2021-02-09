import React, {useEffect, useCallback, useState} from 'react'
import { connect, useSelector } from 'react-redux'
import RightPanelSlide from './RightPanelSlide'
import Axios from 'axios'
import { currencies, inputTypeDateValue } from 'helpers'
import { useHistory } from 'react-router-dom'
import { RRule, RRuleSet } from 'rrule'
import PlanName from './PlanName'
import { syncAllPaymentPlanByStudent } from 'helpers/syncStore'

export const CreateAndCancelCurrentPlan = ({studentId, currentPaymentPlanId}) => {
  const {plans} = useSelector(state => state.planReducer)
  const [allPlans, setAllPlans] = React.useState([])
  const [newPlan, setNewPlan] = React.useState('')
  const [deposit, setDeposit] = React.useState(0)  
  const [depositDatePaid, setDepositDatePaid] = React.useState('')  
  const [paymentDateStart, setPaymentDateStart] = React.useState('')  
  const [disAbleSubmitBtn, setDisAbleSubmitBtn] = React.useState(false)
  const [currency, setCurrency] = React.useState('USD')
  const rruleSet = new RRuleSet()
  const [singlePlan, setSinglePlan] = useState({})
  const history = useHistory()

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

  const handleSubmit = React.useCallback(() => {
    const paymentBreakdown = scheduleDateLists().map((item) => ({
      ...item, amount: singlePlan.amount, currency: singlePlan.currency, status: 'Pending'
    }))
    const payload = {
      depositAmount: deposit, 
      currency, 
      depositPaidDate: depositDatePaid, 
      paymentDateStart, 
      paymentPlanId: newPlan,
      paymentBreakdown,
    }
    setDisAbleSubmitBtn(true)
    Axios.post(`/api/student/add_new_and_cancel_the_current_plan/${studentId}/${currentPaymentPlanId}`, payload)
      .then(res => {
        if (res.data) {
          syncAllPaymentPlanByStudent(studentId)
          setTimeout(() => {
            history.replace(`/`)
          }, 200)
        }
      })
      .catch(err => {
        setDisAbleSubmitBtn(false)
        console.log(err)
      })
  }, [history, deposit, currency, depositDatePaid, paymentDateStart, newPlan, studentId, currentPaymentPlanId, scheduleDateLists, singlePlan.amount, singlePlan.currency])

  React.useEffect(() => {
    let unsubscribe = false
    if (plans && plans.length) {
      if (!unsubscribe) {
        Axios.get(`/api/student/all_payment_plans_by_student_id/${studentId}`)
          .then(res => {
            const data = res.data
            const filter = plans.filter(item => {
              for (let i = 0; i < data.length; i++) {
                if (item._id === data[i].paymentPlanId) {
                  return false
                }
              }
              return true
            })
            setAllPlans(filter)
          })
      }
    }
    return () => {
      unsubscribe = true
    }
  }, [plans, studentId])

  React.useEffect(() => {
    if (newPlan === '' || deposit === '' || deposit === 0 || depositDatePaid === '' || paymentDateStart === '') {
      setDisAbleSubmitBtn(true)
    } else {
      setDisAbleSubmitBtn(false)
    }
  }, [newPlan, deposit, depositDatePaid, paymentDateStart])

  useEffect(() => {
    let unmount = false
    if (newPlan !== '') {
      Axios.get(`/api/plan/${newPlan}`)
        .then(res => {
          if (!unmount) setSinglePlan(res.data)
        })
        .catch(err => console.log(err))
    }
    return () => {
      unmount = true
    }
  }, [newPlan])

  return (
    <RightPanelSlide title="Add New And Cancel The Current Plan">
        <div className="table-responsive table_wrapper" style={{boxShadow: 'none', padding: 0}}>
          <table className="table">
            <thead>
              <tr>
                <th>Current Plan To Cancel</th>
                <th><PlanName planId={currentPaymentPlanId} /></th>
              </tr>
              <tr>
                <th>New Plan</th>
                <th>
                  <select className="form-control app-input"
                    value={newPlan}
                    onChange={e => setNewPlan(e.target.value)}
                    style={{fontSize: '14px'}}
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

export default connect()(CreateAndCancelCurrentPlan)
