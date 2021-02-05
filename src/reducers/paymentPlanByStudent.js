const initialState = {
  paymentPlanByStudent: [],
}

const paymentPlanByStudent = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_PAYMENT_PLAN_BY_STUDENT': 
      return {
        paymentPlanByStudent: action.payload.data
      }
      case 'ADD_PAYMENT_PLAN_BY_STUDENT': 
        return {
          ...state,
          paymentPlanByStudent: [action.payload.data, ...state.paymentPlanByStudent]
        }
    default:
      return state
  }
}

export {
  paymentPlanByStudent
}