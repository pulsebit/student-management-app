import React, {useState, useCallback} from 'react'
import { connect, useSelector } from 'react-redux'
import { BiFilterAlt } from "react-icons/bi"
import status from 'helpers/status'
import { useHistory } from 'react-router-dom'

const StudentListsFilter = () => {
  const {plans} = useSelector(state => state.planReducer)
  const [toggleSearchMore, setToggleSearchMore] = useState(false)

  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [paymentPlanId, setPaymentPlanId] = useState('')
  const [salesRep, setSalesRep] = useState('')
  const [contractSigned, setContractSigned] = useState('')
  const [statusSearch, setStatusSearch] = useState('')
  const history = useHistory()

  const handleSearch = useCallback(() => {
    history.push(`?search=${search}`)
  }, [history, search])

  const handleAdvancedSearch = useCallback(() => {
    const queryParams = `${name !== '' ? `&name=${name}` : ''}${email !== '' ? `&email=${email}` : ''}${paymentPlanId !== '' ? `&paymentPlan=${paymentPlanId}` : ''}${salesRep !== '' ? `&salesRep=${salesRep}` : ''}${contractSigned !== '' ? `&contractSigned=${contractSigned}` : ''}${statusSearch !== '' ? `&status=${statusSearch}` : ''}`
    history.push(`?${queryParams}`)
    setTimeout(() => {
      setToggleSearchMore(false)
    }, 100)
  }, 
    [history, name, email, paymentPlanId, salesRep, contractSigned, statusSearch]
  )

  return (
    <div className="search-wrapper">

      <div className="left-search-bar">
        <input type="text" className="form-control app-input mr-1" placeholder="Search Name / Email"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="btn app-primary-btn" 
        disabled={search === ''}
          onClick={handleSearch}
        >search</button>
      </div>

      <div className="right-search-bar" style={{position: 'relative'}}>

        <button className="advance-filter-btn btn" onClick={() => setToggleSearchMore(state => !state)}>
          <BiFilterAlt/>
        </button>

        {toggleSearchMore && (
          <div className="filter-container">
            <input type="text" className="form-control app-input mr-1 item" placeholder="Name" 
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <input type="email" className="form-control app-input mr-1 item" placeholder="Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
            <select className="form-control app-input mr-1 item"
              value={paymentPlanId}
              onChange={e => setPaymentPlanId(e.target.value)}
            >
              <option value="">--Payment Plan--</option>
              {plans.length && plans.map((item, key) => (
                <option value={item._id} key={key}>{item.resultName}</option>
              ))}
            </select>
            <input type="text" className="form-control app-input mr-1 item" placeholder="Sales Rep" 
              value={salesRep}
              onChange={e => setSalesRep(e.target.value)}
            />
            <input type="text" className="form-control app-input mr-1 item" placeholder="Contract Signed" 
              value={contractSigned}
              onChange={e => setContractSigned(e.target.value)}
            />
            <select className="form-control app-input mr-1 item"
              value={statusSearch}
              onChange={e => setStatusSearch(e.target.value)}
            >
              <option value="">--Status--</option>
              {status && status.map((item, key) => (
                <option value={item.name} key={key}>{item.name}</option>
              ))}
            </select>
            <div className="item">
              <button className="btn mr-2" onClick={() => setToggleSearchMore(state => state = false)}>cancel</button>
              <button className="btn app-primary-btn"
                onClick={handleAdvancedSearch}
              >search</button>
            </div>
          </div>
        )} 

      </div>
    </div>
  )
}

export default connect()(StudentListsFilter)
