import { useEffect, useLayoutEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import DialoguePlayer from './DialoguePlayer'
import SceneLayout from './SceneLayout'
import FragmentFusionAnimation from './FragmentFusionAnimation'
import { getOpeningFlow } from '../data/openingStory'
import {
  areRequiredMissionsComplete,
  loadGameState,
  saveGameState,
} from '../state/gameState'
import './GhostOpeningStory.css'

function GhostOpeningStory() {
  const navigate = useNavigate()
  const location = useLocation()

  const [openingFlow] = useState(() => {
    let gameState = loadGameState()
    const hasWarningCursor = Boolean(location.state?.dialogueCursor)

    if (!hasWarningCursor) {
      const shouldRestartFiveMissionEnding =
        areRequiredMissionsComplete(gameState) &&
        gameState.missions['mission-6'].storyWrapped !== true

      gameState = {
        ...gameState,
        dialogueCursor: null,
        ...(shouldRestartFiveMissionEnding
          ? {
              completionInstructionsSeen: false,
              finalInstructionsActive: false,
            }
          : {}),
      }

      saveGameState(gameState)
    }

    return {
      ...getOpeningFlow(gameState),
      hasPlayerCategory: gameState.playerCategory !== null,
    }
  })

  const [restoredCursor] = useState(
    () => location.state?.dialogueCursor ?? null,
  )

  const restoredOpeningCursor =
    restoredCursor?.screen === 'opening' &&
    restoredCursor.phase === openingFlow.phase

  const choiceIndex = openingFlow.dialogue.findIndex(
    (line) => Array.isArray(line.choices),
  )

  const [openingLineIndex, setOpeningLineIndex] = useState(() => {
    if (location.state?.showMissionChoices && choiceIndex >= 0) {
      return choiceIndex
    }

    if (restoredOpeningCursor) {
      return Math.min(
        restoredCursor.lineIndex,
        openingFlow.dialogue.length - 1,
      )
    }

    return 0
  })

  const [ghostBlinkStarted, setGhostBlinkStarted] = useState(false)
  const [ghostBlinkFinished, setGhostBlinkFinished] = useState(false)

  const currentLine = openingFlow.dialogue[openingLineIndex]
  const isLastLine =
    openingLineIndex === openingFlow.dialogue.length - 1
  const isAtBoothPrompt =
    currentLine?.type === 'final-instructions' && isLastLine

  const isInitialGhostOpeningLine =
    openingFlow.phase === 'opening-introduction' &&
    openingLineIndex === 0

  const showOpeningSprite =
    openingFlow.phase === 'opening-introduction' &&
    !currentLine.choices

    const [spriteLayout, setSpriteLayout] = useState(null)

  useLayoutEffect(() => {
    const textbox = document.querySelector(
      '.ghost-opening-story .textbox-container',
    )

    if (!showOpeningSprite || !textbox) {
      setSpriteLayout(null)
      return
    }

    const updateSpriteLayout = () => {
      const textboxTop = textbox.getBoundingClientRect().top

      setSpriteLayout({
        centerY: (textboxTop * 2) / 3,
        maxHeight: (textboxTop * 2) / 3,
      })
    }

    updateSpriteLayout()

    const observer = new ResizeObserver(updateSpriteLayout)
    observer.observe(textbox)
    window.addEventListener('resize', updateSpriteLayout)
    window.visualViewport?.addEventListener('resize', updateSpriteLayout)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateSpriteLayout)
      window.visualViewport?.removeEventListener('resize', updateSpriteLayout)
    }
  }, [openingLineIndex, openingFlow.phase, showOpeningSprite])

  const showGhostBlink =
    isInitialGhostOpeningLine && !ghostBlinkFinished

  useEffect(() => {
    if (
      !isInitialGhostOpeningLine ||
      ghostBlinkStarted ||
      ghostBlinkFinished
    ) {
      return undefined
    }

    const timer = window.setTimeout(
      () => setGhostBlinkStarted(true),
      100,
    )

    return () => window.clearTimeout(timer)
  }, [
    isInitialGhostOpeningLine,
    ghostBlinkStarted,
    ghostBlinkFinished,
  ])

  useEffect(() => {
    if (!openingFlow.hasPlayerCategory) return

    const gameState = loadGameState()
    const cursor = {
      screen: 'opening',
      phase: isAtBoothPrompt
        ? 'five-mission-booth'
        : openingFlow.phase,
      lineIndex: openingLineIndex,
    }

    saveGameState({
      ...gameState,
      dialogueCursor: cursor,
      finalInstructionsActive: isAtBoothPrompt,
    })
  }, [
    openingLineIndex,
    isAtBoothPrompt,
    openingFlow.hasPlayerCategory,
    openingFlow.phase,
  ])

  function handleAdvance() {
    if (currentLine.choices) return

    const gameState = loadGameState()

    if (currentLine.type === 'mission-complete-notice') {
      saveGameState({
        ...gameState,
        pendingMissionCongratulationsId: null,
        dialogueCursor: null,
      })
    } else if (currentLine.type === 'fragment-fusion') {
      saveGameState({
        ...gameState,
        completionInstructionsSeen: true,
        finalInstructionsActive: false,
      })
    }

    setOpeningLineIndex((index) =>
      Math.min(index + 1, openingFlow.dialogue.length - 1),
    )
  }

  function handleChoiceSelect(choice) {
    const gameState = loadGameState()
    const progress = gameState.missions[choice.id]

    if (!progress) {
      throw new Error(`Saved progress is missing for ${choice.id}.`)
    }

    if (progress.storyWrapped) return

    saveGameState({
      ...gameState,
      activeMissionId: choice.id,
      openingIntroSeen: true,
      pendingMissionCongratulationsId: null,
      dialogueCursor: null,
      missions: {
        ...gameState.missions,
        [choice.id]: {
          ...progress,
          collectionScanReady: false,
        },
      },
    })

    navigate(`/${choice.id}`)
  }

  if (!openingFlow.hasPlayerCategory) {
    return <Navigate to="/" replace />
  }

  const canAdvance = !(
    isLastLine &&
    (currentLine.type === 'final-instructions' ||
      currentLine.type === 'mission-6-terminal')
  )

  const openingStoryScene =
    currentLine.type === 'fragment-fusion' ? (
      <SceneLayout backgroundImage="/images/sg_skyline.png">
        <FragmentFusionAnimation
          collectibles={currentLine.collectibles}
          onComplete={handleAdvance}
        />
      </SceneLayout>
    ) : (
      <SceneLayout backgroundImage="/images/sg_skyline.png">
        <DialoguePlayer
          currentLine={currentLine}
          lineKey={`ghost-opening-${openingFlow.phase}-${openingLineIndex}`}
          canAdvance={canAdvance}
          showContinue={
            currentLine.type !== 'final-instructions' &&
            currentLine.type !== 'mission-6-terminal' &&
            !currentLine.choices
          }
          onAdvance={handleAdvance}
          onChoiceSelect={handleChoiceSelect}
        />
      </SceneLayout>
    )

  return (
    <div
      className={`ghost-opening-story${
        showGhostBlink ? '' : ' is-ghost-opening-ready'
      }`}
    >
      {openingStoryScene}

      {showOpeningSprite && spriteLayout && (
        <div
          className="ghost-opening-sprite-position"
          style={{
            '--opening-sprite-center-y': `${spriteLayout.centerY}px`,
            '--opening-sprite-max-height': `${spriteLayout.maxHeight}px`,
          }}
        >
          <img
            className="ghost-opening-sprite"
            src={`${import.meta.env.BASE_URL}images/willowisp.png`}
            alt=""
            aria-hidden="true"
          />
        </div>
      )}

      {showGhostBlink && (
        <div
          className={`ghost-opening-blink${
            ghostBlinkStarted ? ' is-blinking' : ''
          }`}
          aria-hidden="true"
        >
          <span
            className="ghost-opening-blink__upper"
            onAnimationEnd={() => setGhostBlinkFinished(true)}
          />
          <span className="ghost-opening-blink__lower" />
        </div>
      )}
    </div>
  )
}

export default GhostOpeningStory