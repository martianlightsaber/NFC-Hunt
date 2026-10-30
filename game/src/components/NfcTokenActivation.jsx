// >>> REPLACE ENTIRE FILE: game/src/components/NfcTokenActivation.jsx
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  areRequiredMissionsComplete,
  loadGameState,
  saveGameState,
} from '../state/gameState'
import {
  IRRELEVANT_TOKEN_WARNING,
  PREMATURE_TOKEN_WARNING,
  resolveTokenActivation,
} from '../state/activation'
import { MISSION_BY_COLLECTION_TOKEN } from '../data/missions'

const DIAGNOSTIC_KEY = 'nfc-hunt-activation-diagnostic'
const DIAGNOSTIC_COUNT_KEY = 'nfc-hunt-activation-count'

function saveActivationDiagnostic(diagnostic) {
  window.localStorage.setItem(
    DIAGNOSTIC_KEY,
    JSON.stringify(diagnostic, null, 2),
  )
}

function recordActivationDiagnostic(diagnostic) {
  const attempt =
    Number(window.localStorage.getItem(DIAGNOSTIC_COUNT_KEY) ?? '0') + 1

  window.localStorage.setItem(DIAGNOSTIC_COUNT_KEY, String(attempt))

  const entry = {
    attempt,
    timestamp: new Date().toISOString(),
    ...diagnostic,
  }

  saveActivationDiagnostic(entry)
  return entry
}

function getSavedGamePath(gameState) {
  if (!gameState.ticketNumber || gameState.playerCategory === null) {
    return '/'
  }

  return gameState.activeMissionId
    ? `/${gameState.activeMissionId}`
    : '/opening'
}

function getWarningReturnPath(gameState, cursor) {
  if (cursor?.screen === 'opening') return '/opening'

  if (
    cursor?.screen === 'mission' &&
    cursor.missionId === gameState.activeMissionId
  ) {
    return `/${cursor.missionId}`
  }

  return getSavedGamePath(gameState)
}

function NfcTokenActivation({ routeKind }) {
  const { token } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (cancelled) return

      try {
        const gameState = loadGameState()
        const activation = resolveTokenActivation(
          gameState,
          token,
          routeKind,
        )
const matchedMissionId = MISSION_BY_COLLECTION_TOKEN[token] ?? null
const matchedProgress = matchedMissionId
  ? gameState.missions[matchedMissionId]
  : null

const activationDiagnostic = recordActivationDiagnostic({
  routeKind,
  matchedMissionId,
  result: activation.kind,
  stateBefore: {
    activeMissionId: gameState.activeMissionId,
    playerCategory: gameState.playerCategory,
    collectionScanReady: matchedProgress?.collectionScanReady ?? null,
    itemCollected: matchedProgress?.itemCollected ?? null,
    storyWrapped: matchedProgress?.storyWrapped ?? null,
  },
})
        if (activation.kind === 'silent') {
          const cursor = gameState.dialogueCursor

          navigate(getSavedGamePath(gameState), {
            replace: true,
            state: cursor ? { dialogueCursor: cursor } : null,
          })
          return
        }

        if (
          activation.kind === 'irrelevant' ||
          activation.kind === 'premature'
        ) {
          const cursor = gameState.dialogueCursor

          navigate(getWarningReturnPath(gameState, cursor), {
            replace: true,
            state: {
              dialogueCursor: cursor,
              tokenActivationWarning:
                activation.kind === 'premature'
                  ? PREMATURE_TOKEN_WARNING
                  : IRRELEVANT_TOKEN_WARNING,
            },
          })
          return
        }

        if (activation.kind === 'resume') {
          const resumedState = {
            ...gameState,
            playerCategory:
              gameState.playerCategory === null
                ? activation.category
                : gameState.playerCategory,
            dialogueCursor: null,
          }

          if (!resumedState.ticketNumber) {
            saveGameState(resumedState)
            navigate('/', { replace: true })
            return
          }

          if (resumedState.activeMissionId) {
            const missionId = resumedState.activeMissionId
            const progress = resumedState.missions[missionId]

            if (!progress) {
              throw new Error(
                `Saved progress is missing for ${missionId}.`,
              )
            }

            saveGameState({
              ...resumedState,
              missions: {
                ...resumedState.missions,
                [missionId]: {
                  ...progress,
                  collectionScanReady: false,
                },
              },
            })
            navigate(`/${missionId}`, { replace: true })
            return
          }

          const shouldRestartFiveMissionEnding =
            areRequiredMissionsComplete(resumedState) &&
            resumedState.missions['mission-6'].storyWrapped !== true

          saveGameState({
            ...resumedState,
            ...(shouldRestartFiveMissionEnding
              ? {
                  completionInstructionsSeen: false,
                  finalInstructionsActive: false,
                }
              : {}),
          })
          navigate('/opening', { replace: true })
          return
        }

        if (activation.kind === 'collect') {
          const progress = gameState.missions[activation.missionId]

          if (!progress) {
            throw new Error(
              `Saved progress is missing for ${activation.missionId}.`,
            )
          }

          saveGameState({
            ...gameState,
            dialogueCursor: {
              screen: 'mission',
              missionId: activation.missionId,
              phase: 'wrap-up',
              lineIndex: 0,
            },
            missions: {
              ...gameState.missions,
              [activation.missionId]: {
                ...progress,
                collectionScanReady: false,
                itemCollected: true,
                collectionRevealSeen: false,
              },
            },
          })

activationDiagnostic.result = 'collect saved'
activationDiagnostic.stateAfter = {
  activeMissionId: gameState.activeMissionId,
  collectionScanReady: false,
  itemCollected: true,
  collectionRevealSeen: false,
}
saveActivationDiagnostic(activationDiagnostic)

          navigate(`/${activation.missionId}`, { replace: true })
          return
        }

        if (activation.kind === 'start-mission-6') {
          const progress = gameState.missions['mission-6']

          if (!progress) {
            throw new Error('Saved progress is missing for mission-6.')
          }

          saveGameState({
            ...gameState,
            activeMissionId: 'mission-6',
            mission6Unlocked: true,
            finalInstructionsActive: false,
            pendingMissionCongratulationsId: null,
            dialogueCursor: null,
            missions: {
              ...gameState.missions,
              'mission-6': {
                ...progress,
                collectionScanReady: false,
              },
            },
          })
          navigate('/mission-6', { replace: true })
        }
      } catch (activationError) {
        if (!cancelled) {
          setError(
            activationError instanceof Error
              ? activationError.message
              : 'Unable to process this NFC interaction.',
          )
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [navigate, routeKind, token])

  if (error) return <p role="alert">{error}</p>
  return <p>Processing NFC interaction...</p>
}

export default NfcTokenActivation
// <<< END REPLACEMENT