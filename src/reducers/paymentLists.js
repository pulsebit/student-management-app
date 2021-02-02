const initialState = {
  paymentLists: [],
}

const paymentListsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_PAYMENT_LISTS': 
      return {
        paymentLists: action.payload.data
      }
    default:
      return state
  }
}

export {
  paymentListsReducer
}