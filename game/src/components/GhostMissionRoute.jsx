import { Navigate } from 'react-router-dom'
import SceneLayout from './SceneLayout'
import GhostMissionFlow from './GhostMissionFlow'
import {
  areRequiredMissionsComplete,
  loadGameState,
} from '../state/gameState'
import './GhostMissionStory.css'

function GhostMissionRoute({ missionId, mission }) {
  const gameState = loadGameState()
  const isMission6 = missionId === 'mission-6'
  const canOpenMission =
    gameState.playerCategory !== null &&
    gameState.activeMissionId === missionId &&
    (!isMission6 ||
      (gameState.playerCategory === 'add-on' &&
        gameState.mission6Unlocked &&
        areRequiredMissionsComplete(gameState)))

  if (!canOpenMission) {
    const returnPath =
      !gameState.ticketNumber || gameState.playerCategory === null
        ? '/'
        : gameState.activeMissionId
          ? `/${gameState.activeMissionId}`
          : '/opening'

    return <Navigate to={returnPath} replace />
  }

  return (
    <div className="ghost-mission-story">
      <SceneLayout
        backgroundImage={
          mission.backgroundImage ?? '/images/moonlitgarden.jpg'
        }
      >
        <GhostMissionFlow missionId={missionId} mission={mission} />
      </SceneLayout>
    </div>
  )
}

export default GhostMissionRoute