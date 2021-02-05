const initialState = {
  paymentLists: {},
}

const paymentListsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_PAYMENT_LISTS': 
      return {
        paymentLists: {
          loading: false,
          paymentPlanId: action.payload.paymentPlanId,
          status: action.payload.status,
          data: action.payload.data
        }
      }
    default:
      return state
  }
}

export {
  paymentListsReducer
}