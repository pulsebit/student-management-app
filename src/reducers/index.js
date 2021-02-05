import {combineReducers} from 'redux'
import {currentUser, auth} from './currentUser'
import {notesReducer} from './notes'
import {statusState} from './status'
import {studentReducer} from './student'
import {tagReducer} from './tag'
import {planReducer} from './plan'
import {paymentBDReducer} from './paymentBD'
import {paymentListsReducer} from './paymentLists'
import {paymentPlanByStudent} from './paymentPlanByStudent'
import {loadingPaymentList} from './loadingPaymentList'


export default combineReducers({
  currentUser,
  auth,
  notesReducer,
  statusState,
  studentReducer,
  tagReducer,
  planReducer,
  paymentBDReducer,
  paymentListsReducer,
  paymentPlanByStudent,
  loadingPaymentList
})