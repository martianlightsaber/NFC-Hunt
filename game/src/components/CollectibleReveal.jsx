import { useState } from 'react'
import './CollectibleReveal.css'

function CollectibleReveal({ collectible, onContinue }) {
  const [animationComplete, setAnimationComplete] = useState(false)

  function handleKeyDown(event) {
    if (
      animationComplete &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault()
      onContinue()
    }
  }

  return (
    <section
      className={`collectible-reveal${animationComplete ? ' is-ready' : ''}`}
      aria-labelledby="collectible-reveal-title"
      onClick={animationComplete ? onContinue : undefined}
      onKeyDown={handleKeyDown}
      role={animationComplete ? 'button' : undefined}
      tabIndex={animationComplete ? 0 : undefined}
      aria-label={animationComplete ? 'Continue to mission story' : undefined}
    >
      <h2 id="collectible-reveal-title">Item collected</h2>

      <div
        className="collectible-reveal__stamp"
        role="status"
        aria-live="polite"
        onAnimationEnd={() => setAnimationComplete(true)}
      >
        {collectible.image ? (
          <img src={collectible.image} alt={collectible.name} />
        ) : (
          <span>{collectible.name}</span>
        )}
      </div>

      <p className="collectible-reveal__prompt" aria-live="polite">
        {animationComplete ? 'Tap anywhere to continue' : ' '}
      </p>
    </section>
  )
}

export default CollectibleReveal