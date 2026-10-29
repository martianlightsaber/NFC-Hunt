// >>> REPLACE ENTIRE FILE: game/src/components/OpeningStoryScreen.jsx
import { useEffect, useState } from 'react'
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

function OpeningStoryScreen() {
  const navigate = useNavigate()
  const location = useLocation()

  const [opening] = useState(() => {
    let gameState = loadGameState()
    const hasWarningCursor = Boolean(
      location.state?.dialogueCursor,
    )

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

    const flow = getOpeningFlow(gameState)

    return {
      ...flow,
      hasPlayerCategory: gameState.playerCategory !== null,
    }
  })

  const [restoredCursor] = useState(
    () => location.state?.dialogueCursor ?? null,
  )

  const restoredOpeningCursor =
    restoredCursor?.screen === 'opening' &&
    restoredCursor.phase === opening.phase

  const choiceIndex = opening.dialogue.findIndex(
    (line) => Array.isArray(line.choices),
  )

  const [lineIndex, setLineIndex] = useState(() => {
    if (location.state?.showMissionChoices && choiceIndex >= 0) {
      return choiceIndex
    }

    if (restoredOpeningCursor) {
      return Math.min(
        restoredCursor.lineIndex,
        opening.dialogue.length - 1,
      )
    }

    return 0
  })

  const currentLine = opening.dialogue[lineIndex]
  const isLastLine = lineIndex === opening.dialogue.length - 1
  const isAtBoothPrompt =
    currentLine?.type === 'final-instructions' && isLastLine

  useEffect(() => {
    if (!opening.hasPlayerCategory) return

    const gameState = loadGameState()
    const cursor = {
      screen: 'opening',
      phase: isAtBoothPrompt
        ? 'five-mission-booth'
        : opening.phase,
      lineIndex,
    }

    saveGameState({
      ...gameState,
      dialogueCursor: cursor,
      finalInstructionsActive: isAtBoothPrompt,
    })
  }, [
    lineIndex,
    isAtBoothPrompt,
    opening.hasPlayerCategory,
    opening.phase,
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

    setLineIndex((index) =>
      Math.min(index + 1, opening.dialogue.length - 1),
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

  if (!opening.hasPlayerCategory) {
    return <Navigate to="/" replace />
  }

  if (currentLine.type === 'fragment-fusion') {
    return (
      <SceneLayout backgroundImage="/images/foggyforest.jpg">
        <FragmentFusionAnimation
          collectibles={currentLine.collectibles}
          onComplete={handleAdvance}
        />
      </SceneLayout>
    )
  }

  const canAdvance =
    !(
      isLastLine &&
      (currentLine.type === 'final-instructions' ||
        currentLine.type === 'mission-6-terminal')
    )

  return (
    <SceneLayout backgroundImage="/images/foggyforest.jpg">
      <DialoguePlayer
        currentLine={currentLine}
        lineKey={`opening-${opening.phase}-${lineIndex}`}
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
}

export default OpeningStoryScreen
// <<< END REPLACEMENT