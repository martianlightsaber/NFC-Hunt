import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const CHANNEL_NAME = 'nfc-hunt-single-tab'
const PROBE_INTERVAL_MS = 150
const PROBE_WINDOW_MS = 900

function SingleTabGate({ children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const tabId = useRef(
    `tab-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  ).current
  const isLeader = useRef(false)
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    if (!('BroadcastChannel' in window)) {
      setStatus('active')
      return undefined
    }

    const channel = new BroadcastChannel(CHANNEL_NAME)
    let probeInterval
    let probeTimeout

    function stopProbing() {
      window.clearInterval(probeInterval)
      window.clearTimeout(probeTimeout)
    }

    channel.onmessage = ({ data }) => {
      if (!data || data.from === tabId) return

      if (data.type === 'probe' && isLeader.current) {
        channel.postMessage({
          type: 'existing-tab',
          from: tabId,
          to: data.from,
        })
        return
      }

      if (data.type === 'existing-tab' && data.to === tabId) {
        stopProbing()
        channel.postMessage({
          type: 'route-handoff',
          from: tabId,
          to: data.from,
          path: `${location.pathname}${location.search}`,
        })
        setStatus('duplicate')
        return
      }

      if (
        data.type === 'route-handoff' &&
        data.to === tabId &&
        isLeader.current &&
        typeof data.path === 'string' &&
        data.path.startsWith('/') &&
        !data.path.startsWith('//') &&
        !data.path.includes('\\')
      ) {
        navigate(data.path, { replace: true })
      }
    }

    function sendProbe() {
      channel.postMessage({ type: 'probe', from: tabId })
    }

    sendProbe()
    probeInterval = window.setInterval(sendProbe, PROBE_INTERVAL_MS)
    probeTimeout = window.setTimeout(() => {
      stopProbing()
      isLeader.current = true
      setStatus('active')
    }, PROBE_WINDOW_MS)

    return () => {
      stopProbing()
      isLeader.current = false
      channel.close()
    }
  }, [location.pathname, location.search, navigate, tabId])

  if (status === 'checking') {
    return <p role="status">Checking for an open game tab...</p>
  }

  if (status === 'duplicate') {
    return (
      <main>
        <p role="status">
          Scan received. Return to your existing game tab to continue.
        </p>
        <button type="button" onClick={() => window.location.reload()}>
          Try this tab again
        </button>
      </main>
    )
  }

  return children
}

export default SingleTabGate