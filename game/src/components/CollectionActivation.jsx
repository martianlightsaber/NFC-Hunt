import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { loadGameState, saveGameState } from '../state/gameState'
import { MISSION_BY_COLLECTION_TOKEN } from '../data/collectionTokens'
import { missions } from '../data/missions'

function CollectionActivation() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [error, setError] = useState('')

    useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (cancelled) return

      try {
        const gameState = loadGameState()
        const missionId = MISSION_BY_COLLECTION_TOKEN[token]
        const activeMissionId = gameState.activeMissionId
        const activeProgress = activeMissionId
          ? gameState.missions[activeMissionId]
          : null

        if (
          activeMissionId &&
          activeProgress &&
          !activeProgress.storyWrapped &&
          missionId !== activeMissionId
        ) {
          navigate(`/${activeMissionId}`, {
            replace: true,
            state: {
              collectionActivationWarning: missionId
                ? 'That is not the token for this mission.'
                : 'This collection token is not recognized.',
            },
          })
          return
        }

        if (!missionId) {
          setError('This collection activation is not recognized.')
          return
        }

        if (!activeMissionId || missionId !== activeMissionId) {
          setError('Open the matching mission before scanning its token.')
          return
        }

        const missionProgress = gameState.missions[activeMissionId]
        const mission = missions[activeMissionId]

        if (!missionProgress) {
          throw new Error(`Saved progress is missing for ${activeMissionId}.`)
        }

        if (!mission?.dialogue?.length) {
          throw new Error(`Mission dialogue is not configured for ${activeMissionId}.`)
        }

        if (missionProgress.storyWrapped) {
          setError('This mission has already been completed.')
          return
        }

        if (missionProgress.itemCollected) {
          navigate(`/${activeMissionId}`, { replace: true })
          return
        }

        const finalDialogueLineIndex = mission.dialogue.length - 1

        if (missionProgress.lineIndex !== finalDialogueLineIndex) {
          navigate(`/${activeMissionId}`, {
            replace: true,
            state: {
              collectionActivationWarning:
                'Continue the mission until the story asks you to search for the item.',
            },
          })
          return
        }

        saveGameState({
          ...gameState,
          missions: {
            ...gameState.missions,
            [activeMissionId]: {
              ...missionProgress,
              itemCollected: true,
              lineIndex: 0,
            },
          },
        })

        navigate(`/${activeMissionId}`, { replace: true })
      } catch (activationError) {
        if (!cancelled) {
          setError(
            activationError instanceof Error
              ? activationError.message
              : 'Unable to record the collected item.',
          )
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [token, navigate])

  if (error) {
    const missionId = MISSION_BY_COLLECTION_TOKEN[token]

    return (
      <div>
        <p role="alert">{error}</p>
        <button
          type="button"
          onClick={() => navigate('/opening')}
        >
          Return to opening
        </button>
      </div>
    )
  }

  return <p>Recording your discovery...</p>
}

export default CollectionActivation