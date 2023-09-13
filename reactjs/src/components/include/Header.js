import React from 'react'
import {Helmet} from "react-helmet";

const Header = ({title}) => {
    return (
        <React.Fragment>
          <Helmet>
            <title>WS Blog | {title}</title>
          </Helmet>
          
    

   
    
    <header className="header">
        <div className="header__top">
            <div className="container">
                <div className="row">
                    <div className="col-lg-6 col-md-7">
                        <div className="header__top__left">
                            <p>WS Blog Code  List</p>
                        </div>
                    </div>
                   
                </div>
            </div>
        </div>
        <div className="container">
            <div className="row">
                <div className="col-lg-3 col-md-3">
                    <div className="header__logo">

                    </div>
                </div>
                
            </div>
            <div className="canvas__open"><i className="fa fa-bars"></i></div>
        </div>
    </header>
    
        </React.Fragment>
    )
}

export default Header
