import Axios from 'axios'
import React, {useCallback} from 'react'
import { connect ,useSelector, useDispatch } from 'react-redux'

const StudentNotes = ({studentId}) => {
  const {notes} = useSelector(state => state.notesReducer)
  const dispatch = useDispatch()

  const deleteNote = useCallback((id) => {
    console.log(id)  
    Axios.post(`/api/student/deleteNote/${studentId}/${id}`) 
      .then(res => {
        dispatch({
          type: 'DELETE_NOTE',
          payload: {
            _id: id
          }
        }) 
      })
      .catch(err => console.log(err))
  }, [dispatch, studentId])

  if (notes.length === 0) {
    return (
      <div className="notes__wrapper mb-4">
        <table>
          <thead>
            <tr>
              <th>Notes</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr><td>No notes added.</td><td></td></tr>
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="notes__wrapper mb-4">
      <table>
        <thead>
          <tr>
            <th>Notes</th>
            {notes && notes.length !== 0 ? (<th></th>) : <th></th>}
          </tr>
        </thead>
        <tbody>
          {notes && notes.length === 0 ? (
            <tr><td>No notes added.</td><td></td></tr>
          ) : <tr></tr>}

          {notes && notes.map((item, key) => (
            <tr key={key}>
              <td>{item.note}</td>
              <td>
                <button className="btn btn-sm" style={{background: '#f3f6f8'}} onClick={() => deleteNote(item._id)}>delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(React.memo(StudentNotes))
