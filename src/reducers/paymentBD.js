const initialState = {
  edit: false,
  dataToEdit: {},
  allPaymentBd: []
}

const paymentBDReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'EDIT_BD_PAYMENT':
      return {
        edit: action.payload.edit,
        dataToEdit: action.payload.data
      }
    case 'ALL_BD_PAYMENT': 
      return {
        allPaymentBd: action.payload.data
      }
    default:
      return state
  }
}

export {
  paymentBDReducer
}