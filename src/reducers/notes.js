const initialState = {
  notes: []
}

const notesReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ALL_NOTES_BY_STUDENT':
      return {
        ...state,
        notes: action.payload.data
      }
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(item => item._id !== action.payload._id)
      }
    default:
      return state
  }
}

export {
  notesReducer
}