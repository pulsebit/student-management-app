import React, {useEffect} from 'react'
import { connect, useDispatch } from 'react-redux'
import { HashRouter, Route, useParams, NavLink, useLocation } from 'react-router-dom'
import BreakdownLists from './BreakdownLists'
import CustomBreakdownLists from './CustomBreakdownLists'
import EditPaymentOne from './EditPaymentOne'
import CreatePayment from './CreatePayment'
import Axios from 'axios'

const style = {
    background: '#fff',
    padding: '30px',
}

const StudentPaymentBreakdown = ({paymentPlanId}) => {
  const {studentID} = useParams()
  const {hash} =  useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    Axios.get(`/api/paymentLists/byStudent/${studentID}`)
      .then(res => {
        if (res.data.length) {
          dispatch({
            type: 'ALL_PAYMENT_LISTS', 
            payload: {
              data: res.data
            }
          })
        } 
      })

    return () => {}
  }, [studentID, dispatch])

  return (
    <div className="StudentPaymentBreakdown mb-4" style={style}>

      <HashRouter basename="/">
      <div className="tab-wrapper">
        <NavLink 
          className={hash === '#/' ? 'link-payment-lists' : ''} 
          to="/">Payment Lists</NavLink>
        <NavLink 
          className={hash === '#/new_payment' ? 'link-payment-lists' : ''} 
          to="/new_payment">New Payment</NavLink>
      </div>

        <div className="pt-4 pb-4">
          <Route exact path={`/edit_payment/:paymentId/`}>
            <EditPaymentOne studentId={studentID} />
          </Route>
          <Route exact path={`/new_payment`}>
            <CreatePayment studentId={studentID} paymentPlanId={paymentPlanId} />
          </Route>
          <Route exact path={`/custom_payment_lists`}>
            <CustomBreakdownLists studentId={studentID} />
          </Route>
          <Route exact path="/">
            <BreakdownLists studentId={studentID} />
          </Route>
        </div>
      </HashRouter>

    </div>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(StudentPaymentBreakdown))
