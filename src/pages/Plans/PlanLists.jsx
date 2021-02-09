import React, {useEffect} from 'react'
import { connect, useDispatch, useSelector } from 'react-redux'
import {FaPlus } from "react-icons/fa"
import { Link, useRouteMatch } from 'react-router-dom'
import Axios from 'axios'
import { syncAllPlans } from 'helpers/syncStore'

export const PlanLists = () => {
  const {url} = useRouteMatch()
  const [allPlans, setAllPlans] = React.useState(null)
  const dispatch = useDispatch()
  const {plans} = useSelector(state => state.planReducer)

  const handleDeletePlan = React.useCallback((id) => {
    const confirm = window.confirm('Are you sure?')
    if (confirm) {
      Axios.delete(`/api/plan/${id}`)
      .then(res => {
        if(res.data.deleted) {
          syncAllPlans()
        }
      })
      .catch(err => console.log(err))
    }
  }, [])

  useEffect(() => {
    let isCancelled = false
    if (plans.length) {
      if(!isCancelled) setAllPlans(plans)
    }
    return () => isCancelled = true
  }, [dispatch, plans])


  if (allPlans === null) {
    return <p>Loading...</p>
  }

  return (
    <>
      <Link to={`${url}/create`} className="mb-3 btn btn-primary app-primary-btn">
        <FaPlus/> New Plans
      </Link>
      
      <div className="plans_content table-responsive table_wrapper">
        {allPlans.length === 0 ? (
          <p className="text-center mt-3">No records.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Currency</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {allPlans && allPlans.map((item, i) => (
                <tr key={i}>
                  <td>{item.resultName}</td>
                  <td>{item.currency}</td>
                  <td>
                    <Link to={`${url}/edit/${item._id}`} className="btn btn-sm app-primary-btn mr-2">
                      edit
                    </Link>
                    <button className="btn btn-sm btn-danger"
                      onClick={() => handleDeletePlan(item._id)}
                    >delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(PlanLists)
