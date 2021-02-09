import React from 'react'
import { connect, useSelector } from 'react-redux'
import { HashRouter, Route, useParams } from 'react-router-dom'
import CustomBreakdownLists from './CustomBreakdownLists'
import EditPaymentOne from './EditPaymentOne'
import CreatePayment from './CreatePayment'
import { PaymentPlanAndPaymentListSingleDefaultView } from './PaymentPlanAndPaymentListSingleDefaultView'

const style = {
    background: '#fff',
    padding: '30px',
}

const StudentPaymentBreakdown = ({paymentPlanId}) => {
  const {studentID} = useParams()
  const {paymentPlanByStudent} = useSelector(state => state.paymentPlanByStudent)

  return (
    <div className="StudentPaymentBreakdown mb-4" style={style}>

      <HashRouter basename="/">  

        {(paymentPlanByStudent && paymentPlanByStudent.length) && (
          <>
            <PaymentPlanAndPaymentListSingleDefaultView studentId={studentID} />

            <Route exact path={`/edit_payment/:paymentId/`}>
              <EditPaymentOne studentId={studentID} />
            </Route>

            <Route exact path={`/new_payment/:paymentPlanId`}>
              <CreatePayment studentId={studentID} paymentPlanId={paymentPlanId} />
            </Route>
            
            <Route exact path={`/custom_payment_lists`}>
              <CustomBreakdownLists studentId={studentID} />
            </Route>
          </>
        )}

      </HashRouter>

    </div>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(StudentPaymentBreakdown))
