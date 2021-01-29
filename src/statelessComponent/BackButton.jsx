import React from 'react'
import { FcLeft } from "react-icons/fc"
import { useHistory } from 'react-router-dom'

export default function BackButton() {
  const history = useHistory()
  const returnBack = () => history.goBack()
  return (
    <button className="btn btn-sm" onClick={returnBack}><FcLeft/> Back</button>
  )
}
