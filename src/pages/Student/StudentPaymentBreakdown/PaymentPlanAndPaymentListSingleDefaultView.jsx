import React from 'react'
import { connect, useSelector } from 'react-redux'
import PlanName from '../StudentPlans/PlanName'
import PaymentLists from './BreakdownLists'

export const PaymentPlanAndPaymentListSingleDefaultView = ({studentId}) => {
  const {paymentLists} = useSelector(state => state.paymentListsReducer)
  const {loading} = useSelector(state => state.loadingPaymentList)

  if (loading) {
    return (
      <span>Loading...</span>
    )
  }

  return (
    <>
      <h5 className="payment-plan-name">
        {<PlanName planId={paymentLists.paymentPlanId} />}
        <span 
          className={`ml-2 plan-status 
            ${paymentLists.status === 'Active' && ' active '} 
            ${paymentLists.status === 'On-hold' && ' on-hold '} 
            ${paymentLists.status === 'Completed' && ' completed '} 
            ${paymentLists.status === 'Cancelled' && ' cancelled '}`}
        >{paymentLists.status}</span>
      </h5>

      <PaymentLists studentId={studentId} paymentPlanId={paymentLists.paymentPlanId}  />
    </>
  )
}

export default connect()(PaymentPlanAndPaymentListSingleDefaultView)
