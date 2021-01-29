import React from 'react'
import { connect } from 'react-redux'
import { HashRouter, Route, useParams } from 'react-router-dom'
import BreakdownLists from './BreakdownLists'
import EditPaymentOne from './EditPaymentOne'

const style = {
    background: '#fff',
    padding: '30px',
}

const StudentPaymentBreakdown = () => {
  const {studentID} = useParams()

  return (
    <div className="StudentPaymentBreakdown mb-4" style={style}>
      <p style={{fontWeight: 'bold', color: '#000'}}>Payment Lists</p>

      <HashRouter basename="/">
        <Route exact path={`/edit_payment/:paymentId/`}>
          <EditPaymentOne studentId={studentID} />
        </Route>
        <Route exact path="/">
          <BreakdownLists studentId={studentID} />
        </Route>
      </HashRouter>

    </div>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(StudentPaymentBreakdown))
