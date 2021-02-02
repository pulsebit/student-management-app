import React, {useState, useEffect, useCallback} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import BaseLayout from 'components/BaseLayout'
import Axios from 'axios'
import { Link, useHistory, useRouteMatch } from 'react-router-dom'
import './studentList.css'
import {studentStatus, useQuery} from 'helpers'
// import StudentListsFilter from './StudentListsFilter'
import { FaLongArrowAltLeft, FaLongArrowAltRight } from "react-icons/fa"
import { dateFormatMonthsPref } from 'helpers/dateCreateFormat'

const StudentList = () => {
  // const [toggleName, setToggleName] = useState(false)
  const [allDocsOfPage, setAllDocsOfPage] = useState(0)
  const [allDocs, setAllDocs] = useState(0)
  const [perPage, setPerPage] = useState(0)
  const query = useQuery()
  const name = query.get('name') || ''
  const tag = query.get('tag') || ''
  const qtyOp = query.get('qtyOp') || ''
  const qtyNum = query.get('qtyNum') || ''
  const currency = query.get('currency') || ''
  const paymentType = query.get('paymentType') || ''
  const status = query.get('status') || ''
  const recurrence = query.get('recurrence') || ''
  const paymentTypeOp = query.get('paymentTypeOp') || ''
  const page = query.get('page') || ''
  const dispatch = useDispatch()
  const {students} = useSelector(state => state.studentReducer)
  const history = useHistory()
  const match = useRouteMatch()
  const [plans, setPlans] = useState(null)

  const isFilterName = name !== '' ? `&name=${name}` : ''
  const isFilterTag = tag !== '' ? `&tag=${tag}` : ''
  const isFilterQtyOp = qtyOp !== '' ? `&qtyOp=${qtyOp}` : ''
  const isFilterQtyNum = qtyNum !== '' ? `&qtyNum=${qtyNum}` : ''
  const isFilterCurrency = currency !== '' ? `&currency=${currency}` : ''
  const isFilterPaymentType = paymentType !== '' ? `&paymentType=${paymentType}` : ''
  const isFilterStatus = status !== '' ? `&status=${status}` : ''
  const isFilterRecurrence = recurrence !== '' ? `&recurrence=${recurrence}` : ''
  const isFilterPaymentTypeOp = paymentTypeOp !== '' ? `&paymentTypeOp=${paymentTypeOp}` : ''
  const isFilterPage = page !== '' ? `&page=${page}` : ''

  const queryParams = `${isFilterName}${isFilterTag}${isFilterQtyOp}${isFilterQtyNum}${isFilterCurrency}${isFilterPaymentType}${isFilterStatus}${isFilterRecurrence}${isFilterRecurrence}${isFilterPaymentTypeOp}`

  // const handleToggleName = useCallback(() => {
  //   Axios.get(`/api/student/?order=${toggleName ? 'asc' : 'desc'}&orderBy=lastName&${queryParams}`)
  //     .then(res => {
  //       setToggleName(!toggleName)
  //       dispatch({
  //         type: 'ALL_STUDENT',
  //         payload: {
  //           data: res.data.student
  //         }
  //       })
  //     }).catch(err => console.log(err.message))
  //   return () => {}
  // }, [
  //     toggleName, 
  //     dispatch,
  //     queryParams
  //   ])

  const handlePrevPage = useCallback(() => {
    if (page !== '' && parseInt(page) > 1) history.push(`?page=${parseInt(page) - 1}${queryParams}`)
    return () => {}
  }, [
    history, 
    queryParams,
    page
  ])

  const handleNextPage = useCallback(() => {   
    if (page === '') history.push(`?page=2${queryParams}`)
    else history.push(`?page=${parseInt(page) + 1}${queryParams}`)  
    return () => {}
  }, [
    history, 
    page, 
    queryParams
  ])


  const getStatusColor = (status) => {
    const stat = studentStatus.find(item => item.name === status)
    return (
      <div style={{background: stat.color}} className="color-status"></div>
    )
  }


  const getPlanOne = useCallback((id) => {
    return plans && plans.find(item => item._id === id)
  }, [plans])


  useEffect(() => {
    Axios.get(`/api/student/?${isFilterPage}${queryParams}`)
      .then(res => {
        setAllDocsOfPage(res.data.allDocsOfPage)
        setAllDocs(res.data.count)
        setPerPage(res.data.perPage)
        dispatch({
          type: 'ALL_STUDENT',
          payload: {
            data: res.data.student
          }
        })
      })
      .catch(err => console.log(err.message))
    return () => {}
  }, [
      dispatch,
      queryParams,
      isFilterPage
    ])

  
  useEffect(() => {
    const unsubscribe = Axios.get('/api/plan')
      .then(res => {
        setPlans(res.data.plans)
      })
      .catch(err => console.log(err))
    return () => unsubscribe
  }, [])


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
        {/* <div className="search-box"></div><StudentListsFilter/></div> */}
        <div className="status_legend">
          {studentStatus && studentStatus.map((item, i) => (
            <div key={i} className="status_legend__single_wrapper">
              <div style={{background: item.color}} className="status_legend__color"></div>
              <span className="status_legend__text">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="table-responsive table_wrapper">
        {students.length === 0 ? <span>No student.</span> : (
          <table className="table">
            <thead>
              <tr>
                <th></th>
                <th>
                  Name
                  {/*<button 
                    onClick={handleToggleName}
                  >
                    Name {toggleName ? <FaChevronUp/> : <FaChevronDown/> }
                </button>  */}
                </th>
                <th>Payment Type Plan</th>
                <th>Contract Signed</th>
                <th>Status</th>
                <th>Joined Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students && students.map((item, key) => (
                <tr key={key}>
                  <td>
                    {item.paymentInfo.paymentStatus && getStatusColor(item.paymentInfo.paymentStatus)}
                  </td>
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
                    <span className="studentListPaymentTypeName">
                      {getPlanOne(item.paymentInfo.paymentPlanId) && getPlanOne(item.paymentInfo.paymentPlanId).resultName}
                    </span>
                  </td>
                  <td>
                    <span className="studentListContract">
                      {item.paymentInfo.contractSigned && item.paymentInfo.contractSigned}
                    </span>
                  </td>
                  <td>
                    <span className="studentListStatus">
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
                      <button className="btn app-primary-btn mr-1">View</button>
                    </Link>
                    <Link to={`${match.path}/edit/${item._id}`}>
                      <button className="btn app-primary-btn">Edit</button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {allDocs > perPage  ? (
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
        ): ''}
        
      </div>
    </BaseLayout>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(StudentList))
