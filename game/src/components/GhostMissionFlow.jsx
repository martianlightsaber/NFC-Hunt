import { useEffect, useLayoutEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  areRequiredMissionsComplete,
  loadGameState,
  saveGameState,
} from '../state/gameState'
import CollectibleReveal from './CollectibleReveal'
import DialoguePlayer from './DialoguePlayer'
import FragmentFusionAnimation from './FragmentFusionAnimation'

function GhostMissionFlow({ missionId, mission }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [missionProgress, setMissionProgress] = useState(() => {
    const progress = loadGameState().missions[missionId]

    if (!progress) {
      throw new Error(`Saved progress is missing for ${missionId}.`)
    }

    return progress
  })

  const [restoredCursor] = useState(
    () => location.state?.dialogueCursor ?? null,
  )

  const phase = missionProgress.itemCollected ? 'wrap-up' : 'mission'
  const dialogue = missionProgress.itemCollected
    ? mission.wrapUpDialogue
    : mission.dialogue

  const isWarningReturn =
    restoredCursor?.screen === 'mission' &&
    restoredCursor.missionId === missionId &&
    restoredCursor.phase === phase

  const initialLineIndex = isWarningReturn
    ? Math.min(restoredCursor.lineIndex, dialogue.length - 1)
    : 0

  const [lineIndex, setLineIndex] = useState(initialLineIndex)
  const currentLine = dialogue[lineIndex]

    const [centerImageLayout, setCenterImageLayout] = useState(null)

  useLayoutEffect(() => {
    const textbox = document.querySelector(
      '.ghost-mission-story .textbox-container',
    )

    if (!textbox) return

    const updateImageLayout = () => {
      const textboxTop = textbox.getBoundingClientRect().top

      setCenterImageLayout({
        centerY: (textboxTop * 2) / 3,
        maxHeight: (textboxTop * 2) / 3,
      })
    }

    updateImageLayout()

    const observer = new ResizeObserver(updateImageLayout)
    observer.observe(textbox)
    window.addEventListener('resize', updateImageLayout)
    window.visualViewport?.addEventListener('resize', updateImageLayout)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updateImageLayout)
      window.visualViewport?.removeEventListener('resize', updateImageLayout)
    }
  }, [lineIndex, phase])

  const isLastLine = lineIndex === dialogue.length - 1

  const activeBackgroundImage = dialogue
  .slice(0, lineIndex + 1)
  .reduce(
    (background, line) => line.backgroundImage ?? background,
    mission.backgroundImage ?? '/images/moonlitgarden.jpg',
  )

  const precedingCenterImage = dialogue
    .slice(0, lineIndex)
    .reduce((activeImage, line) => {
      if (line.dismissCenterImage) return null
      return line.centerImage ?? activeImage
    }, null)

  const displayedCenterImage = currentLine.dismissCenterImage
    ? precedingCenterImage
    : currentLine.centerImage ?? precedingCenterImage

  const [centerImageExitCompletedLineIndex, setCenterImageExitCompletedLineIndex] =
    useState(null)

  const isCenterImageExitPending =
    currentLine.dismissCenterImage &&
    displayedCenterImage !== null &&
    centerImageExitCompletedLineIndex !== lineIndex

  const cursorPhase =
    missionId === 'mission-6' &&
    phase === 'wrap-up' &&
    isLastLine
      ? 'mission-6-ending'
      : phase

  useEffect(() => {
    if (isWarningReturn) return

    const gameState = loadGameState()
    const progress = gameState.missions[missionId]

    if (!progress) {
      throw new Error(`Saved progress is missing for ${missionId}.`)
    }

    if (progress.collectionScanReady) {
      saveGameState({
        ...gameState,
        missions: {
          ...gameState.missions,
          [missionId]: {
            ...progress,
            collectionScanReady: false,
          },
        },
      })
    }
  }, [missionId, isWarningReturn])

  useEffect(() => {
    const gameState = loadGameState()

    saveGameState({
      ...gameState,
      dialogueCursor: {
        screen: 'mission',
        missionId,
        phase: cursorPhase,
        lineIndex,
      },
    })
  }, [missionId, cursorPhase, lineIndex])

  function updateMissionProgress(updates) {
    const gameState = loadGameState()
    const progress = gameState.missions[missionId]

    if (!progress) {
      throw new Error(`Saved progress is missing for ${missionId}.`)
    }

    const nextProgress = { ...progress, ...updates }

    saveGameState({
      ...gameState,
      missions: {
        ...gameState.missions,
        [missionId]: nextProgress,
      },
    })
    setMissionProgress(nextProgress)

    return { gameState, nextProgress }
  }

  function handleAdvance() {
    if (!missionProgress.itemCollected && currentLine.type === 'scan-prompt') {
      return
    }

    if (missionProgress.itemCollected && isLastLine) {
      const gameState = loadGameState()
      const progress = gameState.missions[missionId]

      if (!progress) {
        throw new Error(`Saved progress is missing for ${missionId}.`)
      }

      const nextProgress = {
        ...progress,
        storyWrapped: true,
        collectionScanReady: false,
      }

      const isRequiredMission = mission.required === true
      const allRequiredCompleteAfterThis =
        isRequiredMission &&
        areRequiredMissionsComplete({
          ...gameState,
          missions: {
            ...gameState.missions,
            [missionId]: nextProgress,
          },
        })

      saveGameState({
        ...gameState,
        activeMissionId: null,
        lastCompletedMissionId: missionId,
        pendingMissionCongratulationsId: isRequiredMission
          ? missionId
          : null,
        openingIntroSeen: true,
        completionInstructionsSeen: allRequiredCompleteAfterThis
          ? false
          : gameState.completionInstructionsSeen,
        finalInstructionsActive: allRequiredCompleteAfterThis
          ? false
          : gameState.finalInstructionsActive,
        dialogueCursor: null,
        missions: {
          ...gameState.missions,
          [missionId]: nextProgress,
        },
      })

      navigate('/opening', { replace: true })
      return
    }

    const nextIndex = Math.min(lineIndex + 1, dialogue.length - 1)
    const nextLine = dialogue[nextIndex]

    if (!missionProgress.itemCollected && nextLine.type === 'scan-prompt') {
      updateMissionProgress({ collectionScanReady: true })
    }

    setLineIndex(nextIndex)
  }

  function handleRevealContinue() {
    updateMissionProgress({
      collectionRevealSeen: true,
      collectionScanReady: false,
    })
    setLineIndex(0)
  }

  function handleAbandonMission() {
    const gameState = loadGameState()
    const progress = gameState.missions[missionId]

    if (!progress) {
      throw new Error(`Saved progress is missing for ${missionId}.`)
    }

    saveGameState({
      ...gameState,
      activeMissionId: null,
      pendingMissionCongratulationsId: null,
      openingIntroSeen: true,
      dialogueCursor: null,
      missions: {
        ...gameState.missions,
        [missionId]: {
          ...progress,
          collectionScanReady: false,
        },
      },
    })

    navigate('/opening', {
      state: { showMissionChoices: true },
    })
  }

  if (
    missionProgress.itemCollected &&
    !missionProgress.collectionRevealSeen
  ) {
    return (
      <CollectibleReveal
        collectible={mission.collectible}
        onContinue={handleRevealContinue}
      />
    )
  }

  if (!missionProgress.itemCollected && currentLine.type === 'fragment-fusion') {
    return (
      <FragmentFusionAnimation
        collectibles={currentLine.collectibles}
        onComplete={handleAdvance}
      />
    )
  }

  const canAdvance =
    !isCenterImageExitPending &&
    (missionProgress.itemCollected
      ? !isLastLine || !missionProgress.storyWrapped
      : currentLine.type !== 'scan-prompt')

    return (
    <>
        <div
            className="ghost-mission-background"
            style={{
                backgroundImage: `url("${import.meta.env.BASE_URL}${activeBackgroundImage.replace(/^\/+/, '')}")`,
            }}
            aria-hidden="true"
        />
        {displayedCenterImage && centerImageLayout && (
        <div className="ghost-mission-center-image-position" style={{
            '--center-image-y': `${centerImageLayout.centerY}px`,
            '--center-image-max-height': `${centerImageLayout.maxHeight}px`,
            }}>
            <div className="ghost-mission-center-image-float">
            <img
              key={displayedCenterImage}
              className={`ghost-mission-center-image${
                currentLine.dismissCenterImage ? ' is-exiting' : ''
              }`}
              src={`${import.meta.env.BASE_URL}${displayedCenterImage.replace(/^\/+/, '')}`}
              alt=""
              aria-hidden="true"
              onAnimationEnd={(event) => {
                if (event.animationName === 'ghost-mission-image-exit') {
                  setCenterImageExitCompletedLineIndex(lineIndex)
                }
              }}
            />
            </div>
        </div>
        )}

        <DialoguePlayer
        currentLine={currentLine}
        lineKey={`ghost-${phase}-${lineIndex}`}
        canAdvance={canAdvance}
        continueLabel={
            missionProgress.itemCollected && isLastLine
            ? 'Finish mission'
            : undefined
        }
        onAdvance={handleAdvance}
        showAbandon={
            missionId !== 'mission-6' && !missionProgress.storyWrapped
        }
        onAbandon={handleAbandonMission}
        />
    </>
    )
}

export default GhostMissionFlow