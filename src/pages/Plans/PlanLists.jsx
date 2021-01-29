import React, {useEffect} from 'react'
import { connect } from 'react-redux'
import { FaPen, FaPlus } from "react-icons/fa"
import { Link, useRouteMatch } from 'react-router-dom'
import Axios from 'axios'

export const PlanLists = () => {
  const {url} = useRouteMatch()
  const [allPlans, setAllPlans] = React.useState(null)

  useEffect(() => {
    let isCancelled = false
    Axios.get('/api/plan')
      .then(res => {
        if (!isCancelled) setAllPlans(res.data.plans)
      })
      .catch(err => console.log(err))
    return () => {
      isCancelled = true
    }
  }, [])


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
                    <Link to={`${url}/edit/${item._id}`} className="btn btn-sm app-primary-btn">
                      <FaPen/> Edit
                    </Link>
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
