import React from 'react'
import { connect ,useSelector } from 'react-redux'

const StudentNotes = () => {
  const {notes} = useSelector(state => state.noteState)

  if (notes.length === 0) {
    return (
      <div className="notes__wrapper">
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
    <div className="notes__wrapper">
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
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

const mapStateToProps = (state) => ({})
const mapDispatchToProps = {}
export default connect(mapStateToProps, mapDispatchToProps)(StudentNotes)
