import React, { useState, useEffect } from 'react'

import { Link, useLocation } from 'react-router-dom'

const Pagination = ({ showPerPage, onPaginationChange,  btns }) => {
  const [counter, setCounter] = useState(1)

  const { pathname } = useLocation()

  useEffect(() => {
    const value = showPerPage * counter
    onPaginationChange(value - showPerPage, value)
    window.scrollTo(0, 0)
  }, [counter, pathname])

  const onButtonClick = (type) => {
    if (type === 'prev') {
      if (counter === 1) {
        setCounter(1)
      } else {
        setCounter(counter - 1)
      }
    } else if (type === 'next') {
      if (btns === counter) {
        setCounter(counter)
      } else {
        setCounter(counter + 1)
      }
    }
  }

  const pageNumbers = []

  for (let i = 0; i < btns; i++) {
    pageNumbers.push(i)
  }

  return (
    <React.Fragment>
      <div className="d-flex justify-content-center">
        <nav aria-label="Page navigation example">
          <ul className="pagination">
            {btns > 1 ? (
              <li className="page-item" key="02220">
                <Link className="page-link" to="/!#" onClick={() => onButtonClick('prev')}>
                  Previous
                </Link>
              </li>
            ) : null}

            {pageNumbers.map((el, index) => (
              <li className={`page-item ${index + 1 === counter ? 'active' : null}`} key={index}>
                <Link className="page-link" to="/!#" onClick={() => setCounter(index + 1)}>
                  {index + 1}
                </Link>
              </li>
            ))}
            {btns > counter ? (
              <li className="page-item" key="03330">
                <Link className="page-link" to="/!#" onClick={() => onButtonClick('next')}>
                  Next
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
    </React.Fragment>
  )
}

export default Pagination
