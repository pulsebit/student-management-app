const initialState = {
  tags: []
}

function tagReducer(state = initialState, action) {
  switch(action.type) {
    case 'ALL_TAGS':
      return {
        ...state,
        tags: action.payload.data
      }
    default:
      return state
  }
}

export {
  tagReducer
}