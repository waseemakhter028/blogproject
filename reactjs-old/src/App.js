import React, { useEffect, useRef } from 'react'

import { BrowserRouter as Router } from 'react-router-dom'

import RouterCmp from './routes/RouterCmp'

const App = () => {
  const btnOffline = useRef()

  const status = () => {
    const on = window.navigator.onLine
    if (!on) btnOffline.current.click()
  }

  useEffect(() => {
    setInterval(() => {
      status()
    }, 2000)
  }, [])

  return (
    <Router>
      <RouterCmp />
      <button
        type="button"
        ref={btnOffline}
        onClick={() => {
          window.location = '/offline'
        }}
        style={{ display: 'none' }}></button>
    </Router>
  )
}

export default App
