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
        const missionId = MISSION_BY_COLLECTION_TOKEN[token]

        if (!missionId) {
          setError('This collection activation is not recognized.')
          return
        }

        const gameState = loadGameState()
        const missionProgress = gameState.missions[missionId]

        if (!missionProgress) {
          throw new Error(`Saved progress is missing for ${missionId}.`)
        }

        const mission = missions[missionId]

        if (!mission?.dialogue?.length) {
          throw new Error(`Mission dialogue is not configured for ${missionId}.`)
        }

        if (missionProgress.itemCollected) {
          navigate(`/${missionId}`, { replace: true })
          return
        }

        const finalDialogueLineIndex = mission.dialogue.length - 1

        if (missionProgress.lineIndex !== finalDialogueLineIndex) {
          navigate(`/${missionId}`, {
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
            [missionId]: {
              ...missionProgress,
              itemCollected: true,
              lineIndex: 0,
            },
          },
        })

        navigate(`/${missionId}`, { replace: true })
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
          onClick={() => navigate(missionId ? `/${missionId}` : '/opening')}
        >
          {missionId ? 'Return to mission' : 'Return to opening'}
        </button>
      </div>
    )
  }

  return <p>Recording your discovery...</p>
}

export default CollectionActivation