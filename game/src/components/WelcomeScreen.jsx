import { useEffect, useState } from 'react'
import './WelcomeScreen.css'
import './DialoguePlayer.css'
import TokenWarning from './TokenWarning'
import { useLocation, useNavigate } from 'react-router-dom'
import { VALID_TICKET_NUMBERS } from '../data/validTickets'
import { loadGameState, saveGameState } from '../state/gameState'

const dialogueLines = [
  'Welcome Miss Hunter to Wang Chuan Tech Pte. Ltd.!',
  "I am OTTO-MENGPO, your guide for today's VR experience.",
  'Today we will visit the Spirit Realm and lend a hand to some troubled spirits!',
  'Are you ready?',
]

function WelcomeScreen() {
  const [lineIndex, setLineIndex] = useState(0)
  const [visibleText, setVisibleText] = useState('')
  const [ticketNumber, setTicketNumber] = useState('')
  const [playerName, setPlayerName] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState('')

  const currentLine = dialogueLines[lineIndex]
  const isLastLine = lineIndex === dialogueLines.length - 1
  const spielComplete = isLastLine && visibleText === currentLine

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (cancelled) return

      try {
        const gameState = loadGameState()

        if (gameState.ticketNumber && gameState.playerCategory !== null) {
          navigate('/opening', { replace: true })
          return
        }

        setPlayerName(gameState.playerName ?? '')
        setTicketNumber(gameState.ticketNumber ?? '')
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : 'Unable to load your saved game.',
          )
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [navigate])

  useEffect(() => {
    if (location.state?.tokenActivationWarning) return undefined
    if (visibleText.length >= currentLine.length) {
      return undefined
    }

    const timer = window.setTimeout(() => {
      setVisibleText(currentLine.slice(0, visibleText.length + 1))
    }, 50)

    return () => window.clearTimeout(timer)
  }, [currentLine, visibleText, location.state?.tokenActivationWarning])

  function handleAdvance() {
    if (location.state?.tokenActivationWarning) return
    if (visibleText !== currentLine) {
      setVisibleText(currentLine)
      return
    }

    if (!isLastLine) {
      setLineIndex((index) => index + 1)
      setVisibleText('')
    }
  }

  function handleSubmit(event) {
    event.preventDefault()
    setError('')
  
    const normalizedName = playerName.trim()
    const normalizedTicket = ticketNumber.trim().toUpperCase()
  
    if (!normalizedName || !normalizedTicket) {
      setError('Please enter both your name and ticket number.')
      return
    }
  
    if (!VALID_TICKET_NUMBERS.includes(normalizedTicket)) {
      setError('That ticket number is not valid. Please check it and try again.')
      return
    }
  
    try {
      const gameState = loadGameState()
      if (gameState.playerCategory === null) {
        setError('Please scan the QR code on your doorgift talisman before entering.')
        return
      }
      saveGameState({
        ...gameState,
        playerName: normalizedName,
        ticketNumber: normalizedTicket,
      })
      navigate('/opening', { replace: true })
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'Unable to save your game.',
      )
    }
  }

  const showTapPrompt = !spielComplete && visibleText === currentLine
  return (
    <main className="welcome-page" onClick={!spielComplete ? handleAdvance : undefined}>
      <div className="welcome-content">
        <div className="welcome-advance">
          <img
            className="welcome-otto"
            src={`${import.meta.env.BASE_URL}images/otto.png`}
            alt="Otto, your guide"
          />

          <div className="welcome-bubble-group">
            <span className="welcome-bubble">
                <span className="welcome-dialogue" aria-live="polite">
                {visibleText}
                </span>
            </span>

            <p
                className={`welcome-tap-prompt${showTapPrompt ? '' : ' is-hidden'}`}
                aria-hidden={!showTapPrompt}
            >
                ▼ Tap to continue
            </p>
          </div>
        </div>

        {spielComplete && (
          <form className="welcome-ticket-form" onSubmit={handleSubmit}> 
            <label className="sr-only" htmlFor="player-name">
                Player name
            </label>
            <input
                id="player-name"
                className="welcome-input"
                type="text"
                placeholder="Your Name"
                autoComplete="off"
                value={playerName}
                onChange={(event) => setPlayerName(event.target.value)}
            />
            <label className="sr-only" htmlFor="ticket-number">
              Ticket number
            </label>
            <input
              id="ticket-number"
              className="welcome-input"
              type="text"
              placeholder="Your Ticket Number"
              autoComplete="off"
              value={ticketNumber}
              onChange={(event) => setTicketNumber(event.target.value)}
            />
            <button className="welcome-enter" type="submit">
              ENTER
            </button>
            {error && (
              <p className="welcome-hint" role="alert">
                  {error}
              </p>
            )}
          </form>
        )}
      </div>
      <TokenWarning />
    </main>
  )
}

export default WelcomeScreen