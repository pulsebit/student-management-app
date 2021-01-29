const initialState = {
  status: []
}

const statusState = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_STATUS':
      return {
        ...state,
        status: action.data
      }
    case 'ADD_NEW_STATUS':
      return {
        ...state,
        status: [...state.status, action.newStatus]
      }
    case 'REMOVE_STATUS':
      return {
        ...state,
        status: state.status.filter(item => item._id !== action._id)
      }
    default:
      return state
  }
}

export {
  statusState
}