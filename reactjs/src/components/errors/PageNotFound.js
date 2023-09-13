import React from 'react'
import {Link} from 'react-router-dom'
import Header from '../include/Header'
import Footer from '../include/Footer'
import './error.css';
const PageNotFound = () => {
    return (
        <React.Fragment>
           <Header title="Page Not Found" />
           
         <div align="center">
            <img src="assets/images/page404.jpg" alt="404" />
            
            <div className="mt-5 mb-5">
            <Link to="/" className="btn btn-success">Back To Home Page</Link>
            </div>
         </div>
          <Footer />
        </React.Fragment>
    )
}

export default PageNotFound
