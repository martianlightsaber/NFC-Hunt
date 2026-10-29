// >>> REPLACE ENTIRE FILE: game/src/components/DialoguePlayer.jsx
import { useLocation } from 'react-router-dom'
import ChoiceList from './ChoiceList'
import DialogueBox from './DialogueBox'
import TokenWarning from './TokenWarning'
import './DialoguePlayer.css'

function DialoguePlayer({
  currentLine,
  lineKey,
  canAdvance,
  continueLabel = 'Tap to continue',
  showContinue = true,
  onAdvance,
  onChoiceSelect,
  showAbandon = false,
  onAbandon,
}) {
  const location = useLocation()
  const warningMessage =
    location.state?.tokenActivationWarning ??
    location.state?.collectionActivationWarning ??
    location.state?.boothActivationWarning

  function handleSceneTap(event) {
    if (warningMessage) return

    if (
      event.target.closest(
        'button, a, input, textarea, select, [role="button"]',
      )
    ) {
      return
    }

    if (currentLine.choices || !canAdvance) return

    onAdvance()
  }

  return (
    <section
      className="dialogue-player"
      onClick={handleSceneTap}
    >
      {showAbandon && (
        <button
          className="mission-abandon-link"
          type="button"
          onClick={onAbandon}
        >
          ◀ Try a different mission
        </button>
      )}

      {currentLine.type === 'final-instructions' && (
        <div
          className="final-soul-display"
          role="img"
          aria-label="The completed fused spirit soul"
        />
      )}

      <DialogueBox key={lineKey} {...currentLine} />

      <div
        className={`dialogue-continue-slot${
          !showContinue || currentLine.choices ? ' is-hidden' : ''
        }`}
      >
        <button
          type="button"
          onClick={onAdvance}
          disabled={!canAdvance || Boolean(currentLine.choices)}
        >
          {continueLabel}
        </button>
      </div>

      {currentLine.choices && (
        <ChoiceList
          choices={currentLine.choices}
          onSelect={onChoiceSelect}
        />
      )}

      <TokenWarning />
    </section>
  )
}

export default DialoguePlayer
// <<< END REPLACEMENT