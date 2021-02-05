import React, {useEffect} from 'react'
import { connect, useSelector } from 'react-redux'

export const PlanName = ({planId}) => {
  const {plans} = useSelector(state => state.planReducer)
  const [plan, setPlan] = React.useState(null)
  useEffect(() => {
    let unsubscribe = false
    if (plans && plans.length) {
      if (!unsubscribe) {
        const planOne = plans.find(item => item._id === planId)
        setPlan(planOne)
      }
    }
    return () => {
      unsubscribe = true
    }
  }, [plans, planId])
  return <>{plan && plan.resultName}</>
}

export default connect()(PlanName)
