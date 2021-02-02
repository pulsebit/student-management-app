import React from 'react'
import {Link} from 'react-router-dom'

 const RightPanelSlide = ({children, title}) => {
  return (
    <div className="right-panel-slide">
      <div className="right-panel-content">
        <div className="right-panel-title">
          <h5 className="mb-0">{title}</h5>
          <Link to="/" className="close-panel-btn">&times;</Link>
        </div>
        <div className="panel-main-content-wrapper">{children}</div>
      </div>
    </div>
  )
}

export default RightPanelSlide
