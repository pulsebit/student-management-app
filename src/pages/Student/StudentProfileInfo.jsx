import React from 'react'
import {months} from 'helpers'

const img = 'https://lh3.googleusercontent.com/-6Gy1FKnYsZg/AAAAAAAAAAI/AAAAAAAAAAA/AMZuuclJGVxP6IiJXfEhLWCfKQUggNyGQA/s48-c/photo.jpg';

const StudentProfileInfo = ({joinedDate, firstName, lastName, email, country, suburb, phone, birthDate}) => {

  const dateFormat = () => {
    const month = months[new Date(joinedDate).getMonth()]
    const day = new Date(joinedDate).getDate()
    const year = new Date(joinedDate).getFullYear()
    return `${month} ${day}, ${year}`
  }

  return (
    <div className="left__info mb-4">
      <div className="image">
        <img src={img} alt="profile"/>
      </div>
      <div className="name">
        <h4>{(`${firstName} ${lastName}`)}</h4>
        <span>{email}</span>
      </div>

      {phone !== '' ? (
        <div className="email">
          <h6>Phone</h6>
          <span>{phone}</span>
        </div>
      ) : ''}

      {joinedDate !== '' ? (
        <div className="email">
          <h6>Joined Date</h6>
          <span>{dateFormat()}</span>
        </div>
      ) : ''}

      {birthDate !== '' ? (
        <div className="email">
          <h6>Birthdate</h6>
          <span>{dateFormat()}</span>
        </div>
      ) : ''} 

      {country !== '' ? (
        <div className="email">
          <h6>Country</h6>
          <span>{country}</span>
        </div>
      ) : ''}

      {suburb !== '' ? (
        <div className="email">
          <h6>Suburb</h6>
          <span>{suburb}</span>
        </div>
      ) : ''}

    </div>
  )
}

export default StudentProfileInfo
