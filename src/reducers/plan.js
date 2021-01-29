const initialState = {
  plans: []
}

const planReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_PLANS':
      return {
        ...state,
        plans: action.payload.data
      }
    case 'PLAN_ONE': 
      return {
        plan: action.payload.data
      }
    default:
      return state
  }
}

export {
  planReducer
}