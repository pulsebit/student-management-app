import React, {useCallback} from 'react'
import { connect, useSelector } from 'react-redux'
import Dropdown from 'react-bootstrap/Dropdown'
import './StudentPlans.css'
import {HashRouter, Link, Route} from 'react-router-dom'
import CreateAndCancelCurrentPlan from './CreateAndCancelCurrentPlan'
import CreateAndHoldCurrentPlan from './CreateAndHoldCurrentPlan'
import Axios from 'axios'
import PlanName from './PlanName'
import { CreateNewPlan } from './CreateNewPlan'
import EditStudentPaymentPlan from './EditStudentPaymentPlan'
import {syncAllPaymentPlanByStudent, syncPaymentLists} from 'helpers/syncStore'

export const StudentPlans = ({studentId}) => {
  const [currentPaymentPlanId, setCurrentPaymentPlanId] = React.useState({})
  const {paymentPlanByStudent} = useSelector(state => state.paymentPlanByStudent)

  const handleGetPaymentLists = useCallback((paymentPlanId) => {
    syncPaymentLists(studentId, paymentPlanId)
  }, [studentId])

  React.useEffect(() => {
    syncPaymentLists(studentId, currentPaymentPlanId.paymentPlanId)
  }, [currentPaymentPlanId, studentId])

  React.useEffect(() => {
    if (paymentPlanByStudent && paymentPlanByStudent.length) {
      const getPaymentPlanId = paymentPlanByStudent.find(item => {
        if (
          item.status === 'Active' || 
          item.status === 'Completed' || 
          item.status === 'On-hold' || 
          item.status === 'Cancelled'
        ) {
          return true
        }
        return false
      })
      setCurrentPaymentPlanId(getPaymentPlanId)
    }
    return () => {}
  }, [paymentPlanByStudent])

  const deleteBtn = useCallback((id, paymentPlanId) => {
    const confirmDelete = window.confirm('Are you sure?')
    if (confirmDelete) {
      Axios.delete(`/api/student/student_payment_plan/${id}/${paymentPlanId}/${studentId}`)
        .then(res => {
          if (res.data) {
            syncAllPaymentPlanByStudent(studentId)
          }
        })
        .catch(err => console.log(err))
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
                {(paymentPlanByStudent && paymentPlanByStudent.length === 0) ? (
                  <Link 
                    replace
                    to="/add_new_plan"
                    className="dropdown-item">Add new plan</Link>
                ) : (
                  <>
                    <Link 
                      replace
                      to="/add_new_and_hold_the_current_plan"
                      className="dropdown-item">Add new and hold the current plan</Link>
                    <Link 
                      replace
                      to="/add_new_and_cancel_the_current_plan" 
                      className="dropdown-item">Add new and cancel the current plan</Link>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown>
          </div>
          {(paymentPlanByStudent && paymentPlanByStudent.length === 0) && (
            <div className="payment-plan-lists">
              <span className="plan-name">No record result.</span>
            </div>
          )}
          {paymentPlanByStudent && paymentPlanByStudent.map((item, key) => (
            <div className="payment-plan-lists" key={key}>
              <span onClick={() => handleGetPaymentLists(item.paymentPlanId)}>
              <span className="plan-name"><PlanName planId={item.paymentPlanId} /></span>
                <span 
                  className={`plan-status 
                    ${item.status === 'Active' && ' active '} 
                    ${item.status === 'On-hold' && ' on-hold '} 
                    ${item.status === 'Completed' && ' completed '} 
                    ${item.status === 'Cancelled' && ' cancelled '}`}
                >{item.status}</span>
              </span>
              <div>
                <Link className="btn btn-sm app-primary-btn mr-2" to={`/edit_payment_plan/${item._id}`}>edit</Link>
                <button onClick={() => deleteBtn(item._id, item.paymentPlanId)} className="btn btn-sm btn-danger" id={item._id}>delete</button>
              </div>
            </div>
          ))}
        </div>

        <Route exact path="/edit_payment_plan/:studentPaymentPlanId">
          <EditStudentPaymentPlan/>
        </Route>

        <Route exact path="/add_new_and_hold_the_current_plan">
          <CreateAndHoldCurrentPlan studentId={studentId} currentPaymentPlanId={currentPaymentPlanId.paymentPlanId} /> 
        </Route>

        <Route exact path="/add_new_and_cancel_the_current_plan">
          <CreateAndCancelCurrentPlan studentId={studentId} currentPaymentPlanId={currentPaymentPlanId.paymentPlanId} />
        </Route>

        <Route exact path="/add_new_plan">
          <CreateNewPlan studentId={studentId} />
        </Route>

      </HashRouter>
    </>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(StudentPlans)
