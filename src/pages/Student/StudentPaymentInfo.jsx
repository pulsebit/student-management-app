import Axios from 'axios'
import { dateFormatMonthsPref } from 'helpers/dateCreateFormat'
import React, {useEffect, useState} from 'react'
import { connect } from 'react-redux'

export const StudentPaymentInfo = ({payment}) => {
  const [originalPlan, setOriginalPlan] = useState({})

  useEffect(() => { 
    Axios.get(`/api/plan/${payment.paymentPlanId}`)
      .then(res => {
        setOriginalPlan(res.data)
      })
      .catch(err => console.log(err))
  }, [ payment.paymentPlanId])

  return (
    <>
      <div className="right__info_complete mb-4">
        <div className="down">
          <div className="row">
            <div className="col-md-3">
              <span className="bold__label">Deposit</span>
              <p><span className="money">{payment.depositAmount} {payment.currency}</span></p>
            </div>
            <div className="col-md-3"> 
              <span className="bold__label">Original Plan</span>
              <p>{originalPlan && originalPlan.resultName}</p>
            </div>

            {payment.paymentDateStart !== '' && (
              <div className="col-md-3"> 
                <span className="bold__label">Payment Date Start</span>
                <p>{dateFormatMonthsPref(payment.paymentDateStart)}</p>
              </div>
            )}

            {payment.contractSigned !== '' && (
              <div className="col-md-3"> 
                <span className="bold__label">Signed Contract</span>
                <p>{payment.contractSigned}</p>
              </div>
            )}
            
            {payment.salesGuy !== '' && (
              <div className="col-md-3"> 
                <span className="bold__label">Sales Guy</span>
                <p>{payment.salesGuy}</p>
              </div>
            )}

            {payment.paymentMethod !== '' && (
              <div className="col-md-3"> 
                <span className="bold__label">Payment Method</span>
                <p>{payment.paymentMethod}</p>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </>
  )
}


const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(StudentPaymentInfo)
