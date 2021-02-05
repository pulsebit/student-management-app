const initialState = {
  loading: false
}

const loadingPaymentList = (state = initialState, action) => {
  switch (action.type) {
    case 'LOADING_PAYMENT_LISTS':
      return {
        loading: action.payload.data
      }
    default:
      return state
  }
}

export {
  loadingPaymentList
}