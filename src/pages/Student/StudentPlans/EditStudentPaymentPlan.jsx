import React, {useEffect, useState, useCallback} from 'react'
import { connect } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { PlanName } from './PlanName'
import RightPanelSlide from './RightPanelSlide'
import Axios from 'axios'
import { currencies } from 'helpers'
import { syncAllPaymentPlanByStudent } from 'helpers/syncStore'

export const EditStudentPaymentPlan = () => {
  const [singleStudentPlan, setSingleStudentPlan] = useState(null)
  const {studentPaymentPlanId} = useParams()
  const [deposit, setDeposit] = React.useState(0)  
  const [currency, setCurrency] = React.useState('USD')
  const [status, setStatus] = React.useState('')
  const history = useHistory()

  const handleUpdate = useCallback(() => {
    const payload = {depositAmount: deposit, currency, status}
    singleStudentPlan && (
      Axios.put(`/api/student/update_student_payment_plan/${singleStudentPlan._id}`, {payload})
        .then(res => {
          if (res.data) {
            syncAllPaymentPlanByStudent(res.data.studentId)
            setTimeout(() => {
              history.replace('/')
            }, 200)
          }
        })
        .catch(err => console.log(err))
    )
  },
  [deposit, currency, status, singleStudentPlan, history])

  useEffect(() => {
    let unsubscribe = false
    Axios.get(`/api/student/student_payment_plan/${studentPaymentPlanId}`)
      .then(res => {
        if (!unsubscribe) {
          if (res.data) {
            setSingleStudentPlan(res.data)
            setStatus(res.data.status)
            setDeposit(res.data.depositAmount)
            setCurrency(res.data.currency)
          }
        }
      })
      .catch(err => console.log(err))
    return () => {
      unsubscribe = true
    }
  }, [studentPaymentPlanId])

  const title = () => {
    return (
      <>
        Edit <span style={{color: 'rgb(53 142 73)'}}>
          <PlanName planId={singleStudentPlan && singleStudentPlan.paymentPlanId} />
          </span> Plan
      </>
    )
  }

  return (
    <RightPanelSlide title={title()}>
      <div className="table-responsive table_wrapper" style={{boxShadow: 'none', padding: 0}}>
          <table className="table">
            <thead>
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
                <th>Status</th>
                <th>
                  <select className="form-control app-input"
                    value={status}
                    onChange={e => setStatus(e.target.value)}
                  >
                    <option value="">--Select Status--</option>
                    <option value="Active">Active</option>
                    <option value="On-hold">On-hold</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </th>
              </tr>
              <tr>
                <th></th>
                <th>
                  <button 
                    onClick={handleUpdate}
                    className="btn app-primary-btn"
                    disabled={status === '' || deposit === ''} 
                    >Update</button>
                </th>
              </tr>
            </thead>
          </table>
      </div> 
    </RightPanelSlide>
  )
}

export default connect()(EditStudentPaymentPlan)
