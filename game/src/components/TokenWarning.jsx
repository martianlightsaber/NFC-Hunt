// >>> CREATE ENTIRE FILE: game/src/components/TokenWarning.jsx
import { useLocation, useNavigate } from 'react-router-dom'

function TokenWarning() {
  const location = useLocation()
  const navigate = useNavigate()
  const warningMessage =
    location.state?.tokenActivationWarning ??
    location.state?.collectionActivationWarning ??
    location.state?.boothActivationWarning

  if (!warningMessage) return null

  function dismissWarning() {
    const dialogueCursor = location.state?.dialogueCursor

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
      </div>
    </div>
  )
}

export default TokenWarning
// <<< END REPLACEMENT