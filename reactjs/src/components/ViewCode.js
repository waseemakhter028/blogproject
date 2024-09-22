import React, { useState, useEffect } from 'react'

import parse from 'html-react-parser'
import { Link, useParams, useHistory } from 'react-router-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism'

import Footer from './include/Footer'
import Header from './include/Header'

const ViewCode = () => {
  const [loader, setLoader] = useState(true)
  const [code, setCode] = useState(null)
  let { id } = useParams()
  const history = useHistory()

  const getData = async () => {
    try {
      if (isNaN(id)) history.push('/404')

      const response = await fetch(`${process.env.REACT_APP_URL}/viewcode/${id}`)
      const data = await response.json()

      if (data.status === 404) {
        history.push('/404')
      } else {
        setCode(data.data)
      }
      setLoader(false)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getData()
  }, [code, loader])

  return (
    <React.Fragment>
      <Header title="View Code" />

      <section className="shop-details">
        {loader ? (
          <div className="text-center" style={{ height: '20rem' }}>
            <img src="assets/images/loader.gif" alt="loader" className="img-fluid" />
          </div>
        ) : (
          <React.Fragment>
            <div className="product__details__pic">
              <div className="container">
                <div className="row">
                  <div className="col-lg-12 col-md-12  col-sm-12">
                    <img
                      src={`data:image/jpeg;base64,${code.image}`}
                      className="img-fluid imgviewcode"
                      alt="codeimage"
                    />
                    <br />
                  </div>
                  <Link to="/" className="btn btn-danger">
                    Back
                  </Link>
                </div>
              </div>
            </div>
            <div className="product__details__content">
              <div className="container">
                <div className="row d-flex justify-content-center">
                  <div className="col-lg-8">
                    <div className="product__details__text">
                      <h4 className="text-info">{code.title}</h4>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="product__details__tab">
                      <div className="tab-content">
                        <div className="tab-pane active" id="tabs-5" role="tabpanel">
                          <div className="product__details__tab__content">
                            <SyntaxHighlighter language={code.language} style={okaidia}>
                              {parse(code.description)}
                            </SyntaxHighlighter>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        )}
      </section>
      <section className="related spad"></section>
      <Footer />
    </React.Fragment>
  )
}

export default ViewCode
