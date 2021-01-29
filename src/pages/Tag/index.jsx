import BaseLayout from 'components/BaseLayout'
import React, {useState, useEffect} from 'react'
import axios from 'axios'
import './index.css'

const Tag = () => {
  const [tag, setTag] = useState('')
  const [tagLists, setTagLists] = useState([])

  const addTag = () => {
    axios.post('/api/tag/create', {name: tag})
      .then(res => {
        setTagLists(tagList => [
          ...tagList,
          res.data.tag
        ])
        setTag('')
      })
      .catch(err => console.log(err))
  }

  useEffect(() => {
    getTags()
    return () => {}
  }, [])

  function getTags() {
    axios.get('/api/tag')
      .then(res => {
        setTagLists(res.data.tags)
      })
      .catch(err => console.log(err))
  }

  return (
    <BaseLayout>
      <h2 className="title">Tags</h2>
      <div className="col-md-6 TagCreate">
        <div className="form-group">
          <input 
            type="text"  
            placeholder="Enter Tag Name" className="form-control" 
            value={tag} 
            onChange={(e) => setTag(e.target.value)}
          />
        </div>
        <div className="form-group">
          <button className="btn btn-primary" onClick={addTag} disabled={tag === ''}>Add Tag</button>
        </div>
      </div>

      <div className="TagLists col-md-12">
        {tagLists && tagLists.map((item, key) => (
          <div className="tag__list_main" key={key}>
            #{item.name}
          </div>
        ))}
      </div>
    </BaseLayout>
  )
}

export default Tag
