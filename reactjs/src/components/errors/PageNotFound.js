import React from 'react'

import { Link } from 'react-router-dom'

import Footer from '../include/Footer'
import Header from '../include/Header'

import './error.css'
const PageNotFound = () => {
  return (
    <React.Fragment>
      <Header title="Page Not Found" />

      <div id="img-container" style={{ display: 'flex', justifyContent: 'center' }}>
        <div>
          <img src="assets/images/page404.jpg" alt="404" />

          <div className="mt-5 mb-5" style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/" className="btn btn-success">
              Back To Home Page
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </React.Fragment>
  )
}

export default PageNotFound
