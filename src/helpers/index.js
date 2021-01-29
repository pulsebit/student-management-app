import logout from './logout'
import onAuthStateChanged from './onAuthStateChanged'
import dateCreatedFormat from './dateCreateFormat'
import inputTypeDateValue from './inputTypeDateValue'
import {months} from './dateCreateFormat'
import useQuery from 'helpers/useQuery'
import currencies from './currencies'
import studentStatus from './status'

const paymentRecurrenceType = ['Weekly', 'Fortnightly', 'Monthly']

export {
  logout,
  onAuthStateChanged,
  dateCreatedFormat,
  inputTypeDateValue,
  months,
  useQuery,
  currencies,
  paymentRecurrenceType,
  studentStatus
}