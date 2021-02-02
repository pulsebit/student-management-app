import React from 'react'
import { connect } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import './StudentPlans.css'
import {HashRouter, Link, Route} from 'react-router-dom'
import CreateAndCancelCurrentPlan from './CreateAndCancelCurrentPlan'
import CreateAndHoldCurrentPlan from './CreateAndHoldCurrentPlan'
import Axios from 'axios'
import {useSelector} from 'react-redux'

export const StudentPlans = ({studentId}) => {
  const [studentPaymentPlans, setStudentPaymentPlans] = React.useState([])
  const [currentPaymentPlanId, setCurrentPaymentPlanId] = React.useState('')

  React.useEffect(() => {
    let unsubscribe = false
    Axios.get(`/api/student/all_payment_plans_by_student_id/${studentId}`)
      .then(res => {
        if (!unsubscribe) {
          setStudentPaymentPlans(res.data)
          if (res.data && res.data.length) {
            const getPaymentPlanId = res.data.find(item => item.status === 'Active')
            setCurrentPaymentPlanId(getPaymentPlanId._id)
          }
        }
      })
      .catch(err => console.log(err))
    return () => {
      unsubscribe = true
    }
  }, [studentId])

  return (
    <>
      <HashRouter basename="/">
        <div className="payment-plans-wrapper">
          <div className="title-heading">
            <h4 className="mr-2">Payment Plans</h4>
            <Dropdown>
              <Dropdown.Toggle variant="" id="dropdown-basic" className="btn-sm"></Dropdown.Toggle>
              <Dropdown.Menu>
                <Link 
                  to="/add_new_and_hold_the_current_plan"
                  className="dropdown-item">Add new and hold the current plan</Link>
                <Link 
                  to="/add_new_and_cancel_the_current_plan" 
                  className="dropdown-item">Add new and cancel the current plan</Link>
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {studentPaymentPlans && studentPaymentPlans.map((item, key) => (
            <div className="payment-plan-lists" key={key}>
              <a href="#facebook">
                <PaymentPlanName id={item.paymentPlanId} />
                <span 
                  className={`plan-status 
                    ${item.status === 'Active' && ' active '} 
                    ${item.status === 'On-hold' && ' on-hold '} 
                    ${item.status === 'Completed' && ' completed '} 
                    ${item.status === 'Cancelled' && ' cancelled '}`}
                >{item.status}</span>
              </a>
              <button className="btn btn-sm app-primary-btn" id={item._id}>edit</button>
            </div>
          ))}
        </div>

        <Route path="/add_new_and_hold_the_current_plan">
          <CreateAndHoldCurrentPlan studentId={studentId} currentPaymentPlanId={currentPaymentPlanId} /> 
        </Route>
        <Route path="/add_new_and_cancel_the_current_plan">
          <CreateAndCancelCurrentPlan/>
        </Route>
      </HashRouter>
    </>
  )
}

const PaymentPlanName = ({id}) => {
  const [resultName, setResultName] = React.useState(null)
  const {plans} = useSelector(state => state.planReducer)
  React.useEffect(() => {
    let unsubscribe = false
    if (plans && plans.length) {
      const planOne = plans.find(item => item._id === id)
      if (!unsubscribe) setResultName(planOne)
    } else {
      Axios.get(`/api/plan/${id}`)
        .then(res => {
          if (!unsubscribe) setResultName(res.data)
        })
        .catch(err => console.log(err))
    }
  }, [id, plans])

  if (resultName === null) {
    return (
      <span className="plan-name">Loading...</span>
    )
  }
  return (
    <span className="plan-name">{resultName.resultName}</span>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(StudentPlans)
