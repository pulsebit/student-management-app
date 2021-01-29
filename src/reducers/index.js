import {combineReducers} from 'redux'
import {currentUser, auth} from './currentUser'
import {notesReducer} from './notes'
import {statusState} from './status'
import {studentReducer} from './student'
import {tagReducer} from './tag'
import {planReducer} from './plan'
import {paymentBDReducer} from './paymentBD'


export default combineReducers({
  currentUser,
  auth,
  notesReducer,
  statusState,
  studentReducer,
  tagReducer,
  planReducer,
  paymentBDReducer
})