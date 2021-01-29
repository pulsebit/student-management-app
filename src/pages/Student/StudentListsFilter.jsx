import React, {useState, useCallback, useEffect} from 'react'
import { connect } from 'react-redux'
import {currencies, paymentRecurrenceType, studentStatus} from 'helpers'
import { useHistory } from 'react-router-dom'
import Axios from 'axios'
import { FaSlidersH } from "react-icons/fa"
import Dropdown from 'react-bootstrap/Dropdown'
import {useQuery} from 'helpers'

const StudentListsFilter = () => {
  const [filterName, setFilterName] = useState('')
  const [filterTag, setFilterTag] = useState('')
  const [filterQtyOp, setFilterQtyOp] = useState('')
  const [filterQtyNum, setFilterQtyNum] = useState('')
  const [filterCurrency, setFilterCurrency] = useState('')
  const [filterPaymentType, setFilterPaymentType] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterRecurrence, setFilterRecurrence] = useState('')
  const [filterPaymentTypeOp, setFilterPaymentTypeOp] = useState('')
  const [tagDropdown, setTagDropdown] = useState([])
  const history = useHistory()
  const query = useQuery()
  const page = query.get('page') || ''

  const handleFilter = useCallback(() => {
    const isFilterName = filterName !== '' ? `name=${filterName}` : ''
    const isFilterTag = filterTag !== '' ? `&tag=${filterTag}` : ''
    const isFilterQtyOp = filterQtyOp !== '' ? `&qtyOp=${filterQtyOp}` : ''
    const isFilterQtyNum = filterQtyNum !== '' ? `&qtyNum=${filterQtyNum}` : ''
    const isFilterCurrency = filterCurrency !== '' ? `&currency=${filterCurrency}` : ''
    const isFilterPaymentType = filterPaymentType !== '' ? `&paymentType=${filterPaymentType}` : ''
    const isFilterStatus = filterStatus !== '' ? `&status=${filterStatus}` : ''
    const isFilterRecurrence = filterRecurrence !== '' ? `&recurrence=${filterRecurrence}` : ''
    const isFilterPaymentTypeOp = filterPaymentTypeOp !== '' ? `&paymentTypeOp=${filterPaymentTypeOp}` : ''
    const isFilterPage = page !== '' ? `&page=${page}` : ''

    history.push(`?${isFilterName}${isFilterTag}${isFilterQtyOp}${isFilterQtyNum}${isFilterCurrency}${isFilterPaymentType}${isFilterStatus}${isFilterRecurrence}${isFilterRecurrence}${isFilterPaymentTypeOp}${isFilterPage}`)

    document.getElementsByClassName('search__query-box_expand')[0].classList.remove('show') 

    }, [
        history, 
        filterName, 
        filterTag, 
        filterQtyOp,
        filterQtyNum,
        filterCurrency,
        filterPaymentType,
        filterStatus,
        filterRecurrence,
        page,
        filterPaymentTypeOp
      ]
  )

  const handleClearFilter = useCallback(() => {
    setFilterName('')
    setFilterTag('')
    setFilterQtyOp('')
    setFilterQtyNum('')
    setFilterCurrency('')
    setFilterPaymentType('')
    setFilterStatus('')
    setFilterRecurrence('')
  }, [])

  useEffect(() => {
    Axios.get('/api/tag')
      .then(res => setTagDropdown(res.data.tags))
      .catch(err => console.log(err))
  }, [])

  return (
    <>
    <Dropdown>
    <div className="search__query-box">
      <Dropdown.Toggle  id="dropdown-basic"
        className="btn btn-sm search-btn" 
        style={{width: "fit-content"}}
      >
        <FaSlidersH/> Filter
      </Dropdown.Toggle>
          
      </div>

      <Dropdown.Menu className="search__query-box_expand" show={false}>
        <div>
          <div className="form-group search__query-box_expand__name">
            <span>Name</span>
            <input type="text" className="form-control form-control-sm"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
            />
          </div>
          <div className="form-group search__query-box_expand__tag">
            <span>Tag</span>
            <select className="form-control form-control-sm"
              value={filterTag}
              onChange={e => setFilterTag(e.target.value)}
            >
              <option value=""></option>
              {tagDropdown && tagDropdown.map((tag, i) => (
                <option value={tag.name} key={i}>{tag.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group search__query-box_expand__qty">
            <span>Quantity</span>
            <div>
              <select className="form-control form-control-sm mr-2"
                value={filterQtyOp}
                onChange={e => setFilterQtyOp(e.target.value)}
              >
                <option value=""></option>
                <option value=">=">greater than or equal</option>
                <option value="<=">less than or equal</option>
              </select>
              <input type="number" className="form-control form-control-sm"
                value={filterQtyNum}
                onChange={e => setFilterQtyNum(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group search__query-box_expand__currency-paymentType">
            <div className="mr-2">
              <span>Currency</span>
              <select className="form-control form-control-sm"
                value={filterCurrency}
                onChange={e => setFilterCurrency(e.target.value)}
              >
                <option value=""></option>
                {currencies && currencies.map(cur => (
                  <option value={cur} key={cur}>{cur}</option>
                ))}
              </select>
            </div>
            <div>
              <span>Payment Type</span>
              <select className="form-control form-control-sm" 
                value={filterPaymentType}
                onChange={e => setFilterPaymentType(e.target.value)}
              >
                <option value=""></option>
                {paymentRecurrenceType && paymentRecurrenceType.map(rt => (
                  <option value={rt} key={rt}>{rt}</option>
                ))}
              </select>
            </div>
          </div>
          {filterPaymentType !== '' ? (
            <div className="form-group search__query-box_expand__recurrence_amount">
              <span>{filterPaymentType} Amount</span>
              <div>
                <select className="form-control form-control-sm mr-2"
                  value={filterPaymentTypeOp}
                  onChange={e => setFilterPaymentTypeOp(e.target.value)}
                >
                  <option value=""></option>
                  <option value=">=">greater than or equal</option>
                  <option value="<=">less than or equal</option>
                </select>
                <input type="text" className="form-control form-control-sm" 
                  value={filterRecurrence}
                  onChange={e => setFilterRecurrence(e.target.value)}
                />
              </div>
            </div>
          ) : ''}
          <div className="form-group search__query-box_expand__status">
            <span>Status</span>
            <select className="form-control form-control-sm"
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
            >
              <option value=""></option>
              {studentStatus && studentStatus.map((stat, i) => (
                <option key={i} value={stat.name}>{stat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group search__query-box_expand__submit-btn mb-0 text-right">
            <button className="btn btn-sm btn-secondary mr-2" onClick={handleClearFilter}>Clear</button>
            <button className="btn btn-sm btn-primary" onClick={handleFilter}>Submit</button>
          </div>
        </div>
      </Dropdown.Menu>
    </Dropdown>
    </>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(StudentListsFilter))
