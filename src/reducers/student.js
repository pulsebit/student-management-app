const initialState = {
  students: null
}

const studentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_STUDENT':
      return {
        ...state,
        students: action.payload.data
      }
    default:
      return state
  }
}

export {
  studentReducer
}