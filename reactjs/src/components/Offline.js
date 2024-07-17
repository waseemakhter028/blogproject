import React, { useEffect } from 'react'

import { useHistory } from 'react-router-dom'
const Offline = () => {
  const history = useHistory()
  const status = () => {
    const on = window.navigator.onLine
    if (on) history.goBack()
  }

  useEffect(() => {
    setInterval(() => {
      status()
    }, 2000)
  }, [])
  return (
    <div style={{ display: 'flex', alignSelf: 'center' }}>
      <div className="mt-5">
        <h3>No internet</h3>
        Try:
        <br />
        Checking the network cables, modem, and router <br />
        Reconnecting to Wi-Fi
        <br />
      </div>
    </div>
  )
}

export default Offline
