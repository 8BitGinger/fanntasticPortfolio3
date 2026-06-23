import React from 'react'

const PageBreak = ({ children, theme }) => {
  return (
    <div className={`page-break page-break--${theme}`}>
      {children}
    </div>
  )
}

export default PageBreak