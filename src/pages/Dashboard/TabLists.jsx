import React, {useState, useEffect} from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'

export const TabLists = ({dispatch}) => {
  const [tabs, setTabs] = useState([])

  useEffect(() => {
    axios.get('/api/tab')
      .then(res => {
        setTabs(res.data)
      })
      .catch(err => console.log(err.message))
    return () => {}
  }, [setTabs, dispatch])
  
  return (
    <>
      {tabs && tabs.map((item, key) => (
        <div className="col-md-3" key={key}>
          <Link to={`/tab/${item._id}`} className="tab__link">
            <span className="tab__text">{item.name}</span>
          </Link>
        </div>
      ))}
    </>
  )
}

export default connect()(TabLists)
