import React, { useState, useEffect } from 'react'

import { $ } from 'react-jquery-plugin'
import Pagination from 'react-js-pagination'
import { Link } from 'react-router-dom'

import GetSubCat from './GetSubCat'
import Footer from './include/Footer'
import Header from './include/Header'

const Home = () => {
  const [btnFilter, setBtnFilter] = useState(false)
  const [loader, setLoader] = useState(true)
  const [codes, setCodes] = useState([])
  const [categories, setCategories] = useState([])
  const [catcounter, setCatCounter] = useState(null)
  const [pages, setPages] = useState('')

  useEffect(() => {}, [loader])

  const getData = async (pageNumber = 1) => {
    window.scrollTo(0, 0)
    setLoader(true)
    try {
      const response = await fetch(`${process.env.REACT_APP_URL}?page=${pageNumber}`)
      const data = await response.json()
      setCategories(data.categories)
      setCodes(data.codes.data)
      setPages(data.codes)
      setTimeout(() => {
        setLoader(false)
      }, 2000)
    } catch (err) {
      console.log(err)
    }
  }

  const clearFilter = async () => {
    $('input').filter(':checkbox').prop('checked', false)
    setBtnFilter(false)
    getData()
  }

  const [showPerPage, setShowPerPage] = useState(6)
  const [pagination, setPagination] = useState({
    start: 0,
    end: showPerPage
  })

  const filterData = async (value) => {
    window.scrollTo(0, 0)
    setLoader(true)
    setCodes(value)
    setShowPerPage(6)
    setPagination({ start: 0, end: 6 })
    setTimeout(() => {
      setLoader(false)
    }, 2000)
  }

  const filterBtn = (show) => {
    setBtnFilter(show)
  }

  function setCategory() {
    setCatCounter(catcounter + 1)
    $('input').filter(':checkbox').prop('checked', false)
  }

  useEffect(() => {
    getData()
    setTimeout(() => {
      setLoader(false)
    }, 2000)
  }, [])

  return (
    <React.Fragment>
      <Header title="Code List" />
      {/*Breadcrumb Section Begin*/}
      <section className="breadcrumb-option">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="breadcrumb__text">
                <h4>Code Listing</h4>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/*-- Breadcrumb Section End --*/}

      <section className="shop spad">
        <div className="container">
          <div className="row">
            <div className="col-lg-3">
              {btnFilter ? (
                <React.Fragment>
                  <button
                    type="button"
                    className="btn btn-primary float-right"
                    id="btnfilter"
                    onClick={clearFilter}>
                    Clear Filter
                  </button>
                  <br />
                  <br />
                  <br />
                </React.Fragment>
              ) : null}

              <div className="shop__sidebar__accordion">
                <div className="accordion" id="accordionExample">
                  {categories.map((cat, index) => (
                    <div className="card" key={cat.id}>
                      <div className="card-heading">
                        <Link
                          data-toggle="collapse"
                          data-target={`#collapseOne${index}`}
                          onClick={() => {
                            setCategory()
                          }}>
                          {cat.name}
                        </Link>
                      </div>
                      <div
                        id={`collapseOne${index}`}
                        className="collapse"
                        data-parent="#accordionExample">
                        <div className="card-body">
                          <div className="shop__sidebar__categories">
                            <ul className="nice-scroll" tabIndex={index} key={cat.id}>
                              <GetSubCat
                                key={cat.id}
                                filterData={filterData}
                                filterBtn={filterBtn}
                                subcats={cat.SubCategories}
                              />
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="col-lg-9">
              {/*code list start here */}
              <div className="row">
                {!loader ? (
                  codes.length < 1 ? (
                    <span></span>
                  ) : (
                    codes.slice(pagination.start, pagination.end).map((row, i) => (
                      <div className="col-lg-4 col-md-6 col-sm-6" key={i}>
                        <div className="product__item">
                          <div
                            className="product__item__pic set-bg"
                            data-setbg={`data:image/jpeg;base64,${row.image}`}
                            style={{
                              backgroundImage: `url(data:image/jpeg;base64,${row.image})`
                            }}></div>
                          <div className="product__item__text">
                            <h6>{row.title}</h6>
                            <Link to={`viewcode/${row.id}`} className="add-cart">
                              <i className="fa fa-eye"></i> View Code
                            </Link>
                          </div>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  <img src="assets/images/loader.gif" alt="loader" />
                )}
              </div>
              {/*code list end here */}

              {pages.total > 6 && !loader && !btnFilter ? (
                <div className="d-flex justify-content-center">
                  <nav aria-label="Page navigation example">
                    <div className="row">
                      <div className="col-lg-12">
                        <Pagination
                          activePage={pages.current_page}
                          itemsCountPerPage={pages.per_page}
                          totalItemsCount={pages.total}
                          pageRangeDisplayed={10}
                          linkClass="page-link"
                          itemClass="page-item"
                          activeClass="active"
                          activeLinkClass="active"
                          onChange={(pageNumber) => getData(pageNumber)}
                        />
                      </div>
                    </div>
                  </nav>
                </div>
              ) : (
                ''
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </React.Fragment>
  )
}

export default Home
