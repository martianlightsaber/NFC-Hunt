import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { VALID_TICKET_NUMBERS } from '../data/validTickets'
import { loadGameState, saveGameState } from '../state/gameState'
import TokenWarning from './TokenWarning'
import './GhostWelcomeScreen.css'

const LINE_BY_STAGE = {
  welcome: 'We have received your exit papers from the Ministry of Souls.',
  namePrompt: 'Please confirm your name',
  ticketPrompt: 'Please confirm your reservation ticket code',
  farewell: 'May your soul cross the Naihe safely',
  goodbye: 'Goodbye.'
}

const TALISMAN_WARNING =
  'Please scan the QR code on your doorgift talisman before entering.'

function GhostWelcomeScreen() {
  const navigate = useNavigate()
  const transitionTimer = useRef(null)

  const [loaded, setLoaded] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [stage, setStage] = useState('welcome')
  const [settled, setSettled] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [lineVisible, setLineVisible] = useState(false)
  const [playerName, setPlayerName] = useState('')
  const [ticketNumber, setTicketNumber] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    try {
      const gameState = loadGameState()

      if (gameState.ticketNumber && gameState.playerCategory !== null) {
        navigate('/opening', { replace: true })
        return
      }

      setPlayerName(gameState.playerName ?? '')
      setTicketNumber(gameState.ticketNumber ?? '')
      setStage(
        gameState.ticketNumber
          ? 'farewell'
          : gameState.playerName
            ? 'ticketPrompt'
            : 'welcome',
      )
      setLoaded(true)
    } catch (caughtError) {
      setLoadError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to load your saved game.',
      )
      setLoaded(true)
    }
  }, [navigate])

  useEffect(() => {
    if (!loaded || loadError) return undefined

    const frame = window.requestAnimationFrame(() => {
      setLineVisible(true)
    })

    return () => window.cancelAnimationFrame(frame)
  }, [loaded, loadError, stage])

  useEffect(() => {
    if (!loaded || loadError) return undefined

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches
    const timer = window.setTimeout(
      () => setSettled(true),
      reducedMotion ? 0 : 1600,
    )

    return () => window.clearTimeout(timer)
  }, [loaded, loadError, stage])

  useEffect(
    () => () => window.clearTimeout(transitionTimer.current),
    [],
  )

  function transitionTo(nextStage) {
    window.clearTimeout(transitionTimer.current)
    setLineVisible(false)
    setIsExiting(false)
    setError('')
    setSettled(false)

    transitionTimer.current = window.setTimeout(() => {
      setStage(nextStage)
      setIsExiting(false)
    }, 2000)
  }

  function handleNameSubmit(event) {
    event.preventDefault()
    setError('')

    const normalizedName = playerName.trim()
    if (!normalizedName) {
      setError('Please enter your name.')
      return
    }

    try {
      const gameState = loadGameState()
      saveGameState({
        ...gameState,
        playerName: normalizedName,
      })
      setPlayerName(normalizedName)
      transitionTo('ticketPrompt')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to save your game.',
      )
    }
  }

  function handleTicketSubmit(event) {
    event.preventDefault()
    setError('')

    const normalizedName = playerName.trim()
    const normalizedTicket = ticketNumber.trim().toUpperCase()

    if (!normalizedName) {
      setError('Please enter your name.')
      return
    }

    if (!VALID_TICKET_NUMBERS.includes(normalizedTicket)) {
      setError('That ticket number is not valid. Please check it and try again.')
      return
    }

    try {
      const gameState = loadGameState()
      saveGameState({
        ...gameState,
        playerName: normalizedName,
        ticketNumber: normalizedTicket,
      })
      setPlayerName(normalizedName)
      setTicketNumber(normalizedTicket)
      transitionTo('farewell')
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : 'Unable to save your game.',
      )
    }
  }

  function handleContinue() {
    if (stage === 'welcome') {
      transitionTo('namePrompt')
      return
    }

    if (stage === 'farewell') {
      transitionTo('goodbye')
      return
    }

    if (stage === 'goodbye') {
      try {
        const gameState = loadGameState()
        const hasTicketQrCategory =
          gameState.playerCategory === 'regular' ||
          gameState.playerCategory === 'add-on'

        if (hasTicketQrCategory) {
          navigate('/opening', { replace: true })
        } else {
          transitionTo('warning')
        }
      } catch (caughtError) {
        setError(
          caughtError instanceof Error
            ? caughtError.message
            : 'Unable to check your saved game.',
        )
      }
    }
  }

  if (!loaded) {
    return <main className="ghost-page" aria-busy="true" />
  }

  const line = LINE_BY_STAGE[stage]
  const hasInput = stage === 'namePrompt' || stage === 'ticketPrompt'
  const showContinue =
    settled && (stage === 'welcome' || stage === 'farewell' || stage === 'goodbye')

  return (
    <main
      className="ghost-page"
      onClick={showContinue ? handleContinue : undefined}
    >
      <div className="ghost-content">
        {loadError ? (
          <p className="ghost-error" role="alert">
            {loadError}
          </p>
        ) : stage === 'warning' ? (
          <p className="ghost-warning" role="alert">
            {TALISMAN_WARNING}
          </p>
        ) : (
          <>
            <section className="ghost-scene" key={stage}>
              <span className="ghost-smoke" aria-hidden="true" />
                <p
                  className={`ghost-line${lineVisible ? ' is-visible' : ''}${isExiting ? ' is-exiting' : ''}`}
                  aria-live="polite"
                >
                {line}
              </p>
            </section>

            {hasInput && settled && (
              <form
                className="ghost-form"
                onSubmit={
                  stage === 'namePrompt'
                    ? handleNameSubmit
                    : handleTicketSubmit
                }
              >
                <label className="sr-only" htmlFor="ghost-player-name">
                  Player name
                </label>
                {stage === 'namePrompt' ? (
                  <input
                    id="ghost-player-name"
                    className="ghost-input"
                    type="text"
                    placeholder="Your name"
                    autoComplete="name"
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                  />
                ) : (
                  <>
                    <label className="sr-only" htmlFor="ghost-ticket-number">
                      Ticket number
                    </label>
                    <input
                      id="ghost-ticket-number"
                      className="ghost-input"
                      type="text"
                      placeholder="Your ticket number"
                      autoComplete="off"
                      value={ticketNumber}
                      onChange={(event) => setTicketNumber(event.target.value)}
                    />
                  </>
                )}

                <button className="ghost-submit" type="submit">
                  Submit
                </button>

                {error && (
                  <p className="ghost-error" role="alert">
                    {error}
                  </p>
                )}
              </form>
            )}

            {showContinue && (
            <button
              className="ghost-continue"
              type="button"
              onClick={(event) => {
                event.stopPropagation()
                handleContinue()
              }}
            >
              ▼ Tap to continue
            </button>
            )}

            {!hasInput && error && (
              <p className="ghost-error" role="alert">
                {error}
              </p>
            )}
          </>
        )}
      </div>

      <TokenWarning />
    </main>
  )
}

export default GhostWelcomeScreen