import { useEffect, useState } from 'react'
import ChoiceList from './ChoiceList'
import DialogueBox from './DialogueBox'
import { useLocation, useNavigate } from 'react-router-dom'
import { loadGameState, saveGameState } from '../state/gameState'
import CollectibleReveal from './CollectibleReveal'
import FragmentFusionAnimation from './FragmentFusionAnimation'
import './DialoguePlayer.css'

function DialoguePlayer({ dialogue, missionId, wrapUpDialogue = [], collectible }) {
  const [missionProgress, setMissionProgress] = useState(() => {
    if (!missionId) return null

    const progress = loadGameState().missions[missionId]
    if (!progress) {
      throw new Error(`Saved progress is missing for ${missionId}.`)
    }

    return progress
  })
  const [openingLineIndex, setOpeningLineIndex] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  function dismissCollectionWarning() {
    navigate(location.pathname, { replace: true, state: null })
  }

  function abandonMission() {
    navigate('/opening')
  }

  const activeDialogue =
    missionId && missionProgress.itemCollected ? wrapUpDialogue : dialogue
  const lineIndex = missionId ? missionProgress.lineIndex : openingLineIndex
  const currentLine = activeDialogue[lineIndex]
  const isLastLine = lineIndex === activeDialogue.length - 1

  useEffect(() => {
    if (missionId) return

    const isAtFinalBoothScreen =
      currentLine?.type === 'final-instructions' && isLastLine

    const gameState = loadGameState()

    if (gameState.finalInstructionsActive !== isAtFinalBoothScreen) {
      saveGameState({
        ...gameState,
        finalInstructionsActive: isAtFinalBoothScreen,
      })
    }
  }, [missionId, currentLine?.type, isLastLine])

  function advanceDialogue() {
    const isMissionWrapUp = missionId && missionProgress.itemCollected

    if (isMissionWrapUp && isLastLine) {
      const gameState = loadGameState()
      const currentProgress = gameState.missions[missionId]

      if (!currentProgress) {
        throw new Error(`Saved progress is missing for ${missionId}.`)
      }

      const nextProgress = {
        ...currentProgress,
        storyWrapped: true,
      }

      if (missionId === 'mission-6') {
        saveGameState({
          ...gameState,
          activeMissionId: null,
          missions: {
            ...gameState.missions,
            [missionId]: nextProgress,
          },
        })
        setMissionProgress(nextProgress)
        return
      }

      saveGameState({
        ...gameState,
        activeMissionId: null,
        lastCompletedMissionId: missionId,
        missions: {
          ...gameState.missions,
          [missionId]: nextProgress,
        },
      })
      navigate('/opening', { replace: true })
      return
    }

    const nextLineIndex = Math.min(lineIndex + 1, activeDialogue.length - 1)

    if (missionId) {
      const gameState = loadGameState()
      const currentProgress = gameState.missions[missionId]

      if (!currentProgress) {
        throw new Error(`Saved progress is missing for ${missionId}.`)
      }

      const nextProgress = {
        ...currentProgress,
        lineIndex: nextLineIndex,
      }

      saveGameState({
        ...gameState,
        missions: {
          ...gameState.missions,
          [missionId]: nextProgress,
        },
      })
      setMissionProgress(nextProgress)
      return
    }

    if (!missionId && currentLine.type === 'fragment-fusion') {
      const gameState = loadGameState()

      saveGameState({
        ...gameState,
        completionInstructionsSeen: true,
        finalInstructionsActive: false,
      })
    }

    setOpeningLineIndex(nextLineIndex)
  }

  function handleSceneTap(event) {
    if (
      location.state?.collectionActivationWarning ||
      location.state?.boothActivationWarning
    ) return
    if (event.target.closest('button, a, input, textarea, select, [role="button"]')) return
    if (currentLine.choices) return

    const cannotAdvance =
      isLastLine &&
      (!missionId || !missionProgress.itemCollected || missionProgress.storyWrapped)

    if (!cannotAdvance) {
      advanceDialogue()
    }
  }

  function handleChoiceSelect(choice) {
    const gameState = loadGameState()
    const currentProgress = gameState.missions[choice.id]

    if (!currentProgress) {
      throw new Error(`Saved progress is missing for ${choice.id}.`)
    }

    if (currentProgress.storyWrapped) return

    saveGameState({
      ...gameState,
      activeMissionId: choice.id,
      missions: {
        ...gameState.missions,
        [choice.id]: {
          ...currentProgress,
          lineIndex: 0,
          itemCollected: false,
          collectionRevealSeen: false,
        },
      },
    })

    navigate(`/${choice.id}`)
  }

  function handleRevealContinue() {
    const gameState = loadGameState()
    const currentProgress = gameState.missions[missionId]

    if (!currentProgress) {
      throw new Error(`Saved progress is missing for ${missionId}.`)
    }

    const nextProgress = {
      ...currentProgress,
      collectionRevealSeen: true,
      lineIndex: 0,
    }

    saveGameState({
      ...gameState,
      missions: {
        ...gameState.missions,
        [missionId]: nextProgress,
      },
    })

    setMissionProgress(nextProgress)
  }

  if (
    missionId &&
    missionProgress.itemCollected &&
    !missionProgress.collectionRevealSeen
  ) {
    return (
      <CollectibleReveal
        collectible={collectible}
        onContinue={handleRevealContinue}
      />
    )
  }

  if (!missionId && currentLine.type === 'fragment-fusion') {
    return (
      <FragmentFusionAnimation
        collectibles={currentLine.collectibles}
        onComplete={advanceDialogue}
      />
    )
  }

  return (
    <section
      className="dialogue-player"
      onClick={handleSceneTap}
    >
      {missionId &&
        missionId !== 'mission-6' &&
        !missionProgress.storyWrapped && (
        <button
          className="mission-abandon-link"
          type="button"
          onClick={abandonMission}
        >
          ◀ Try a different mission
        </button>
      )}
      {(location.state?.collectionActivationWarning ||
        location.state?.boothActivationWarning) && (
        <div
          className="collection-warning"
          role="alertdialog"
          aria-labelledby="collection-warning-message"
        >
          <button
            className="collection-warning__close"
            type="button"
            aria-label="Close warning"
            onClick={dismissCollectionWarning}
          >
            ×
          </button>
          <p id="collection-warning-message">
            {location.state.collectionActivationWarning ??
              location.state.boothActivationWarning}
          </p>
        </div>
        )}
      {!missionId && currentLine.type === 'final-instructions' && (
        <div
          className="final-soul-display"
          role="img"
          aria-label="The completed fused spirit soul"
        />
      )}
      <DialogueBox key={lineIndex} {...currentLine} />

      <div
        className={`dialogue-continue-slot${
          currentLine.choices || currentLine.type === 'final-instructions'
            ? ' is-hidden'
            : ''
        }`}
      >
        <button
          type="button"
          onClick={advanceDialogue}
          disabled={
            currentLine.choices ||
            (isLastLine &&
              (!missionId ||
                !missionProgress.itemCollected ||
                missionProgress.storyWrapped))
          }
        >
          {missionId &&
          missionProgress.itemCollected &&
          isLastLine
            ? missionProgress.storyWrapped
              ? 'Mission complete'
              : 'Finish mission'
            : 'Tap to continue'}
        </button>
      </div>

      {currentLine.choices &&
        (selectedChoice ? (
          <p>You selected: {selectedChoice.label}</p>
        ) : (
          <ChoiceList
            choices={currentLine.choices}
            onSelect={handleChoiceSelect}
          />
        ))}
    </section>
  )
}

export default DialoguePlayer