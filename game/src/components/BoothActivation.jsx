import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ADD_ON_BOOTH_TOKEN } from '../data/collectionTokens'
import {
  areRequiredMissionsComplete,
  loadGameState,
  saveGameState,
} from '../state/gameState'

function BoothActivation() {
  const { token } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    Promise.resolve().then(() => {
      if (cancelled) return

      try {
        const gameState = loadGameState()

        if (gameState.playerCategory === 'regular') {
          navigate('/opening', { replace: true })
          return
        }

        if (token !== ADD_ON_BOOTH_TOKEN) {
          navigate('/opening', {
            replace: true,
            state: {
              boothActivationWarning: 'This booth activation is not recognized.',
            },
          })
          return
        }

        if (gameState.playerCategory !== 'add-on') {
          navigate('/opening', {
            replace: true,
            state: {
              boothActivationWarning:
                'This activation is only available to add-on players.',
            },
          })
          return
        }

        const canStartMission =
          areRequiredMissionsComplete(gameState) &&
          gameState.completionInstructionsSeen &&
          gameState.finalInstructionsActive

        if (!canStartMission) {
          navigate('/opening', {
            replace: true,
            state: {
              boothActivationWarning:
                'Complete all five missions and let the soul fully fuse before seeking help at the booth.',
            },
          })
          return
        }

        const missionProgress = gameState.missions['mission-6']

        if (!missionProgress) {
          throw new Error('Saved progress is missing for mission-6.')
        }

        if (missionProgress.storyWrapped) {
          navigate('/opening', { replace: true })
          return
        }

        saveGameState({
          ...gameState,
          activeMissionId: 'mission-6',
          mission6Unlocked: true,
          finalInstructionsActive: false,
          missions: {
            ...gameState.missions,
            'mission-6': {
              ...missionProgress,
              lineIndex: 0,
              itemCollected: false,
              storyWrapped: false,
              collectionRevealSeen: false,
            },
          },
        })

        navigate('/mission-6', { replace: true })
      } catch (activationError) {
        if (!cancelled) {
          navigate('/opening', {
            replace: true,
            state: {
              boothActivationWarning:
                activationError instanceof Error
                  ? activationError.message
                  : 'Unable to start the add-on mission.',
            },
          })
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [token, navigate])

  return null
}

export default BoothActivation