import React from 'react'
import {Route, Switch, BrowserRouter as Router} from 'react-router-dom'
import Home from '../components/Home'
import ViewCode from '../components/ViewCode'
import NotFoundPage from '../components/errors/PageNotFound'
import ScrollToTop from  '../components/ScrollToTop'
import Offline from '../components/Offline'

export default function RouterCmp() {
    return (
        <>

        <ScrollToTop />
           <Switch>
             <Route exact path='/' component={Home}/>
             <Route exact path='/!' component={Home}/>
             <Route  path='/viewcode/:id' component={ViewCode}/>
             <Route  path='/offline' component={Offline}/>
             {/*Page Not Found*/}
             <Route path="*" component={NotFoundPage} />
            </Switch>


        </>
    )
}