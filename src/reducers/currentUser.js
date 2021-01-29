import * as actions from 'actions'

const currentUser = (state = {}, action) => {
  switch(action.type) {
    case actions.GET_CURRENT_USER:
      return {
        ...state,
        user: action.currentUser
      }
    default:
      return state
  }
}

const auth = (state = false, action) => {
  switch(action.type) {
    case actions.IS_AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: action.isAuthenticated
      }
    default:
      return state
  }
}

export {
  auth,
  currentUser
}

