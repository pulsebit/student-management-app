import Axios from 'axios'
import BaseLayout from 'components/BaseLayout'
import React, {useEffect, useState, useCallback} from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import BackButton from 'statelessComponent/BackButton'
import { connect, useDispatch } from 'react-redux'
import './student-info.css'
import StudentPaymentInfo from './StudentPaymentInfo'
import StudentProfileInfo from './StudentProfileInfo'
import { studentStatus } from 'helpers'
import StudentPaymentBreakdown from './StudentPaymentBreakdown'
import StudentPlans from './StudentPlans'
import {syncAllPaymentPlanByStudent} from 'helpers/syncStore'

function StudentInfo() {
  const {studentID} = useParams()
  const [studentInfoSingle, setStudentInfoSingle] = useState({})
  const [paidByStudent, setPaidByStudent] = useState(0)
  const history = useHistory()
  const dispatch = useDispatch()

  const studentDelete = useCallback(() => {
    const confirmDelete = window.confirm('Are you sure?')
    if (confirmDelete) {
      Axios.delete(`/api/student/${studentID}`)
        .then(res => {
          if (res.data.msg) {
            setTimeout(() => {
              history.goBack()
            }, 500)
          }
        })
        .catch(err => console.log(err))
    }
    return () => {}
  },[studentID, history])

  const getStatusColor = (status) => {
    const stat = studentStatus.find(item => item.name === status)
    return (
      <div className="student_single__status mb-4">
        <div style={{background: stat.color}} className="student_single__status_color"></div>
        <span>{status}</span>
      </div>
    )
  }

  useEffect(() => {
    let unsubscribe = false
    Axios.get(`/api/student/${studentID}`)
      .then(res => {
        if (!unsubscribe) {
          setStudentInfoSingle(res.data.student)
        }
        
      })
      .catch(err => console.log(err))
    return () => {
      unsubscribe = true
    }
  }, [studentID, dispatch])


  useEffect(() => {
    Axios.get(`/api/paymentLists/byAllPaid/${studentID}`)
    .then(res => {
      const paid = res.data;
      let total = 0;
      paid.forEach((item) => total = total + item.amount);
      console.log(total);
      setPaidByStudent(total)
      //console.log(total);
    })
    .catch(err => console.log(err))

  }, [studentID])

  useEffect(() => {
    syncAllPaymentPlanByStudent(studentID)
  }, [studentID])

  if (Object.keys(studentInfoSingle).length === 0) {
    return (
      <BaseLayout>
        <span>Loading...</span>
      </BaseLayout>
    )
  }

  return (
    <BaseLayout>
      <div className="StudentInfo">
        <BackButton/>
        <div className="action">
          <div className="row">
            <div className="col-md-3">
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'flex-end'
                }}>
                <Link to={`/students/edit/${studentID}`}>Edit Info</Link>
                </div>
            </div>
            <div className="col-md-9">
              
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-3">
            <StudentProfileInfo
              firstName={studentInfoSingle.firstName || ''}
              lastName={studentInfoSingle.lastName || ''}
              joinedDate={studentInfoSingle.joinedDate || ''}
              country={studentInfoSingle.country || ''}
              suburb={studentInfoSingle.suburb || ''}
              email={studentInfoSingle.email || ''}
              birthDate={studentInfoSingle.birthdate || ''}
              phone={studentInfoSingle.phone || ''}
            />
            <div className="actions-wrapper">
              <button 
                className="btn btn-danger delete__student_profile_btn" 
                onClick={studentDelete}
              >Delete</button>
            </div>
          </div>
          <div className="col-md-9">
            {getStatusColor(studentInfoSingle.paymentInfo.paymentStatus)}

            <StudentPaymentInfo payment={studentInfoSingle.paymentInfo} paid={paidByStudent} pipeline={studentInfoSingle.pipeline || ''}/>

            <StudentPlans studentId={studentID} />

            <StudentPaymentBreakdown paymentPlanId={studentInfoSingle.paymentInfo.paymentPlanId} />
          </div>
        </div>
      </div>
    </BaseLayout>
  )
}

export default connect()(StudentInfo)
