import React from 'react'
import { connect } from 'react-redux'
import RightPanelSlide from './RightPanelSlide'

export const CreateAndCancelCurrentPlan = () => {
  return (
    <RightPanelSlide title="Add New And Cancel The Current Plan">
      Add New And Cancel The Current Plan
    </RightPanelSlide>
  )
}

export default connect()(CreateAndCancelCurrentPlan)
