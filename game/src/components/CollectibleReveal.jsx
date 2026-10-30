import { useState } from 'react'
import TokenWarning from './TokenWarning'
import './CollectibleReveal.css'

function CollectibleReveal({ collectible, onContinue }) {
  const [animationComplete, setAnimationComplete] = useState(false)
  const [isExiting, setIsExiting] = useState(false)

  function handleDismiss() {
    if (!animationComplete || isExiting) return
    setIsExiting(true)
  }

  function handleKeyDown(event) {
    if (
      animationComplete &&
      !isExiting &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault()
      handleDismiss()
    }
  }

  function handleStampAnimationEnd(event) {
    if (event.target !== event.currentTarget) return

    if (event.animationName === 'collectible-settle') {
      setAnimationComplete(true)
    } else if (event.animationName === 'collectible-exit') {
      onContinue()
    }
  }

  return (
    <section
      className={`collectible-reveal${animationComplete ? ' is-ready' : ''}${isExiting ? ' is-exiting' : ''}`}
      onClick={animationComplete && !isExiting ? handleDismiss : undefined}
      onKeyDown={handleKeyDown}
      role={animationComplete ? 'button' : undefined}
      tabIndex={animationComplete && !isExiting ? 0 : undefined}
      aria-label={
        animationComplete ? 'Continue to mission story' : collectible.name
      }
    >
      <div
        className="collectible-reveal__stamp"
        role="status"
        aria-live="polite"
        onAnimationEnd={handleStampAnimationEnd}
      >
        {collectible.image ? (
          <img
            src={`${import.meta.env.BASE_URL}${collectible.image.replace(/^\/+/, '')}`}
            alt={collectible.name}
          />
        ) : (
          <span>{collectible.name}</span>
        )}
      </div>

      <p className="collectible-reveal__prompt" aria-live="polite">
        {animationComplete && !isExiting
          ? 'Tap anywhere to continue'
          : ' '}
      </p>

      <TokenWarning />
    </section>
  )
}

export default CollectibleReveal