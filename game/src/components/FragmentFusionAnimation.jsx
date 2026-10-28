import { useState } from 'react'
import './FragmentFusionAnimation.css'

const offsets = [
  [0, -105],
  [95, -35],
  [58, 85],
  [-58, 85],
  [-95, -35],
]

function FragmentFusionAnimation({ collectibles, onComplete }) {
  const [animationComplete, setAnimationComplete] = useState(false)

  function handleCoreAnimationEnd(event) {
    if (
      event.target === event.currentTarget &&
      event.animationName === 'fragment-fusion-core'
    ) {
      setAnimationComplete(true)
    }
  }

  function handleKeyDown(event) {
    if (
      animationComplete &&
      (event.key === 'Enter' || event.key === ' ')
    ) {
      event.preventDefault()
      onComplete()
    }
  }

  return (
    <section
      className={`fragment-fusion${animationComplete ? ' is-ready' : ''}`}
      role={animationComplete ? 'button' : undefined}
      tabIndex={animationComplete ? 0 : undefined}
      aria-label={
        animationComplete
          ? 'Continue to event booth instructions'
          : 'Spirit fragments merging'
      }
      onClick={animationComplete ? onComplete : undefined}
      onKeyDown={handleKeyDown}
    >
      <h2 className="fragment-fusion__title">
        {animationComplete
          ? 'The spirit soul is complete'
          : 'The fragments are joining...'}
      </h2>

      <div className="fragment-fusion__stage">
        {collectibles.map((collectible, index) => {
          const [x, y] = offsets[index] ?? [0, 0]

          return (
            <div
              className="fragment-fusion__item"
              key={collectible.id}
              style={{
                '--offset-x': `${x}px`,
                '--offset-y': `${y}px`,
                '--delay': `${index * 0.15}s`,
              }}
            >
              {collectible.image ? (
                <img src={collectible.image} alt={collectible.name} />
              ) : (
                <span>{collectible.name}</span>
              )}
            </div>
          )
        })}

        <div
          className="fragment-fusion__core"
          role="img"
          aria-label="Fused spirit soul"
          onAnimationEnd={handleCoreAnimationEnd}
        />
      </div>

      <p className="fragment-fusion__prompt" aria-live="polite">
        {animationComplete ? 'Tap anywhere to continue' : ' '}
      </p>
    </section>
  )
}

export default FragmentFusionAnimation