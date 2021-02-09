import React, {useState, useEffect, useCallback} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import BaseLayout from 'components/BaseLayout'
import Axios from 'axios'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import './studentList.css'
import {studentStatus, useQuery} from 'helpers'
import StudentListsFilter from './StudentListsFilter'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa"
import { dateFormatMonthsPref } from 'helpers/dateCreateFormat'
import { PlanName } from './StudentPlans/PlanName'

const StudentList = () => {
  const [allDocsOfPage, setAllDocsOfPage] = useState(0)
  const [allDocs, setAllDocs] = useState(0)
  const [perPage, setPerPage] = useState(0)
  const dispatch = useDispatch()
  const {students} = useSelector(state => state.studentReducer)
  const history = useHistory()
  const match = useRouteMatch()

  const query = useQuery()
  const name = query.get('name') || ''
  const email = query.get('email') || ''
  const paymentPlan = query.get('paymentPlan') || ''
  const salesRep = query.get('salesRep') || ''
  const contractSigned = query.get('contractSigned') || ''
  const statusSearch = query.get('status') || ''
  const search = query.get('search') || ''
  const page = query.get('page') || ''

  const queryParams = `${search !== '' ? `&search=${search}` : ''}${name !== '' ? `&name=${name}` : ''}${email !== '' ? `&email=${email}` : ''}${paymentPlan !== '' ? `&paymentPlan=${paymentPlan}` : ''}${salesRep !== '' ? `&salesRep=${salesRep}` : ''}${contractSigned !== '' ? `&contractSigned=${contractSigned}` : ''}${statusSearch !== '' ? `&status=${statusSearch}` : ''}`

  const handlePrevPage = useCallback(() => {
    if (page !== '' && parseInt(page) > 1) history.push(`?page=${parseInt(page) - 1}${queryParams}`)
  }, [
    history, 
    queryParams,
    page
  ])

  const handleNextPage = useCallback(() => {   
    if (page === '') history.push(`?page=2${queryParams}`)
    else history.push(`?page=${parseInt(page) + 1}${queryParams}`)  
  }, [
    history, 
    page, 
    queryParams
  ])


  const getStatusColor = (status) => {
    const stat = studentStatus.find(item => item.name === status)
    return stat.color
  }

  useEffect(() => {
    Axios.get(`/api/student/?${page !== '' ? `page=${page}` : ''}${queryParams}`)
      .then(res => {
        setAllDocsOfPage(res.data.allDocsOfPage)
        setAllDocs(res.data.count)
        setPerPage(res.data.perPage)
        dispatch({
          type: 'ALL_STUDENT',
          payload: {
            data: res.data.students
          }
        })
      })
  }, [queryParams, dispatch, page])


  if (students === null) {
    return (
      <BaseLayout>
        Loading...
      </BaseLayout>
    )
  }


  return (
    <BaseLayout>
      <h2 className="title">Student Lists</h2>
      <div className="content-top">
        <StudentListsFilter/>
      </div>

      <div className="table-responsive table_wrapper">
        {students.length === 0 ? <span>No student.</span> : (
          <table className="table">
            <thead>
              <tr>
                <th>
                  Name
                  {/*<button 
                    onClick={handleToggleName}
                  >
                    Name {toggleName ? <FaChevronUp/> : <FaChevronDown/> }
                </button>  */}
                </th>
                <th>Payment Plan</th>
                <th>Contract Signed</th>
                <th>Sales Rep</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody style={{fontSize: '14px'}}>
              {students && students.map((item, key) => (
                <tr key={key}>
                  {/* <td>
                    {item.paymentInfo.paymentStatus && getStatusColor(item.paymentInfo.paymentStatus)}
                  </td> */}
                  <td>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} to={`${match.path}/${item._id}`}>
                      <span className="studentListName d-block">
                      {item.lastName && item.lastName}, {item.firstName && item.firstName}
                      </span>
                      <span className="studentListemail d-block">
                        {item.email && item.email}
                      </span>
                    </Link>
                  </td>
                  <td>
                    <PlanNames studentId={item._id} />
                    {/* <span className="studentListPaymentTypeName">
                      <PlanName planId={item.paymentInfo.paymentPlanId} />
                    </span> */}
                  </td>
                  <td>
                    <span className="studentListContract">
                      {item.paymentInfo.contractSigned && item.paymentInfo.contractSigned}
                    </span>
                  </td>
                  <td>
                    <span className="studentListContract">
                      {item.paymentInfo.salesGuy && item.paymentInfo.salesGuy}
                    </span>
                  </td>
                  <td className="text-center">
                    <span className='studentListStatus' style={{
                      background: getStatusColor(item.paymentInfo.paymentStatus)
                    }}>
                      {item.paymentInfo.paymentStatus && item.paymentInfo.paymentStatus}
                    </span>
                  </td>
                  <td>
                    <span className="studentListContract">
                      {item.paymentInfo.joinedDate && dateFormatMonthsPref(item.paymentInfo.joinedDate)}
                    </span>
                  </td>
                  <td>
                    <Link to={`${match.path}/${item._id}`}>
                      <button className="btn app-primary-btn mr-1 btn-sm">View</button>
                    </Link>
                    <Link to={`${match.path}/edit/${item._id}`}>
                      <button className="btn btn-primary btn-sm">Edit</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {allDocs > perPage  ? (
          <>
            <div className="custom_pagination">
              <button className="btn btn-sm"
                disabled={page === '' || parseInt(page) <= 1}
                onClick={handlePrevPage}
              >
                <FaLongArrowAltLeft/> Prev
              </button>
              <button className="btn btn-sm"
                disabled={allDocsOfPage > allDocs}
                onClick={handleNextPage}
              >
                Next <FaLongArrowAltRight/>
              </button>
            </div>
          </>
        ): ''}
        
      </div>
    </BaseLayout>
  )
}

const PlanNames = ({studentId}) => {
  const [planNames, setPlanNames] = useState(null)
  useEffect(() => {
    Axios.get(`/api/student/all_payment_plans_by_student_id/${studentId}`)
      .then(res => {
        setPlanNames(res.data)
      })
      .catch(err => console.log(err))
  }, [studentId])
  if (planNames === null) {
    return <span className="plan_name">Loading...</span>
  }
  if (planNames.length && planNames.length === 0) {
    return <span className="plan_name">No Payment Plan</span>
  }
  return (
    <>
      {planNames && planNames.map((item, key) => (
        <span className="plan_name d-block" key={key}>
          <PlanName planId={item.paymentPlanId} />
        </span>
      ))}
    </>
  )
}

export default connect()(React.memo(StudentList))
