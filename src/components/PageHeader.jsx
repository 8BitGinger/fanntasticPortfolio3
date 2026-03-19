import React from 'react'

const PageHeader = ({ theme, title,  }) => {
  return (
    <div className={`page-header wrapper-${theme} ${theme}`}>
      <h1>{title}</h1>
    </div>
  )
}

export default PageHeader