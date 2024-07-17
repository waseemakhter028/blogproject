import React from 'react'

const Footer = () => {
  return (
    <React.Fragment>
      <footer className="footer">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 text-center">
              <div className="footer__copyright__text">
                <p>
                  Copyright ©<script>document.write(new Date().getFullYear());</script>
                  All rights reserved | WS Blog
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="search-model">
        <div className="h-100 d-flex align-items-center justify-content-center">
          <div className="search-close-switch">+</div>
          <form className="search-model-form">
            <input type="text" id="search-input" placeholder="Search here....." />
          </form>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Footer
