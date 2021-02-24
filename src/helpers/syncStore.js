import Axios from 'axios'
import {store} from 'index'

const syncPaymentLists = (studentId, paymentPlanId) => {
  store.dispatch({
    type: 'LOADING_PAYMENT_LISTS',
    payload: {data: true}
  })
  Axios.get(`/api/student/student-plan/${studentId}/${paymentPlanId}`)
    .then(res => {
      Axios.get(`/api/paymentLists/byStudent/${studentId}/planId/${paymentPlanId}`)
        .then(res2 => {
          store.dispatch({
            type: 'LOADING_PAYMENT_LISTS',
            payload: {data: false}
          })
          store.dispatch({
            type: 'ALL_PAYMENT_LISTS',
            payload: {
              loading: false,
              data: res2.data,
              paymentPlanId: paymentPlanId,
              status: res.data.status,
            }
          })
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

const syncAllPaymentPlanByStudent = (studentId) => {
  Axios.get(`/api/student/all_payment_plans_by_student_id/${studentId}`)
    .then(res => {
      store.dispatch({
        type: 'ALL_PAYMENT_PLAN_BY_STUDENT',
        payload: {
          data: res.data
        }
      })
    })
    .catch(err => console.log(err))
}

const syncAllPaidByStudent = (studentId) => {
  Axios.get(`/api/student/byAllPaid/${studentId}`)
    .then(res => {
      store.dispatch({
        type: 'ALL_PAID_BY_STUDENT',
        payload: {
          data: res.data
        }
      })
    })
    .catch(err => console.log(err))
}

const syncAllPlans = () => {
  Axios.get('/api/plan')
    .then(res => {
      if (res.data.plans && res.data.plans.length) {
        store.dispatch({
          type: 'ALL_PLANS',
          payload: {
            data: res.data.plans
          }
        })
      }
    })
    .catch(err => console.log(err))
}

export {
  syncPaymentLists,
  syncAllPaymentPlanByStudent,
  syncAllPlans,
  syncAllPaidByStudent
}