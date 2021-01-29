import React, {useState, useCallback} from 'react'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import Axios from 'axios'
import {connect, useDispatch} from 'react-redux'

const AddNotesForm = ({studentId}) => {
  const [showModal, setShowModal] = useState(false)
  const [note, setNote] = useState('')
  const dispatch = useDispatch()

  const handleClose = () => setShowModal(false)
  const handleShow = () => setShowModal(true)

  const handleSubmit = useCallback(() => {
    Axios.post(`/api/student/addNotes/${studentId}`, {note})
      .then(res => {
        setShowModal(false)
        dispatch({
          type: 'ALL_NOTES_BY_STUDENT',
          payload: {
            data: res.data
          }
        })
      })
      .catch(err => console.log(err))
  }, [studentId, note, dispatch])

  return (
    <div className="text-right student_single__notes_action">
      <button onClick={handleShow} className="btn btn-secondary btn-sm">Add notes</button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Notes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <textarea className="form-control" placeholder="Enter notes" name="" id="" cols="30" rows="10"
            onChange={e => setNote(e.target.value)}
            value={note}
          ></textarea>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}

export default connect()(AddNotesForm)
