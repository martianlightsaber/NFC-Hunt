import { Navigate } from 'react-router-dom'
import SceneLayout from './SceneLayout'
import MissionFlow from './MissionFlow'
import {
  areRequiredMissionsComplete,
  loadGameState,
} from '../state/gameState'

function MissionRoute({ missionId, mission }) {
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
    <SceneLayout
      backgroundImage={
        mission.backgroundImage ?? '/images/moonlitgarden.jpg'
      }
    >
      <MissionFlow missionId={missionId} mission={mission} />
    </SceneLayout>
  )
}

export default MissionRoute