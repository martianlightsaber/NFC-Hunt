// >>> CREATE ENTIRE FILE: game/src/components/TokenWarning.jsx
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function TokenWarning() {
  const location = useLocation()
  const navigate = useNavigate()
  const warningFromLocation =
    location.state?.tokenActivationWarning ??
    location.state?.collectionActivationWarning ??
    location.state?.boothActivationWarning
  const [warningMessage, setWarningMessage] = useState(warningFromLocation)
  const [activationDiagnostic] = useState(
  () => window.localStorage.getItem('nfc-hunt-activation-diagnostic'),
)

  useEffect(() => {
    if (!warningFromLocation) return

    const dialogueCursor = location.state?.dialogueCursor

    navigate(location.pathname, {
      replace: true,
      state: dialogueCursor ? { dialogueCursor } : null,
    })
  }, [location.pathname, location.state, navigate, warningFromLocation])

  if (!warningMessage) return null

  function dismissWarning() {
    const dialogueCursor = location.state?.dialogueCursor
    setWarningMessage(null)

    navigate(location.pathname, {
      replace: true,
      state: dialogueCursor ? { dialogueCursor } : null,
    })
  }

  return (
    <div
      className="collection-warning-backdrop"
      role="presentation"
      onClick={(event) => event.stopPropagation()}
    >
      <div
        className="collection-warning"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="token-warning-message"
      >
        <button
          className="collection-warning__close"
          type="button"
          aria-label="Close warning"
          onClick={dismissWarning}
        >
          ×
        </button>
        <p id="token-warning-message">{warningMessage}</p>
        {activationDiagnostic && (
  <details>
    <summary>Temporary scan diagnostics</summary>
    <pre
      style={{
        maxHeight: '30vh',
        overflow: 'auto',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
        textAlign: 'left',
        fontSize: '0.7rem',
      }}
    >
      {activationDiagnostic}
    </pre>
  </details>
)}
      </div>
    </div>
  )
}

export default TokenWarning
// <<< END REPLACEMENT