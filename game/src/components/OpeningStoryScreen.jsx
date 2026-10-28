import { useEffect, useState } from 'react'
import DialoguePlayer from './DialoguePlayer'
import SceneLayout from './SceneLayout'
import { getOpeningStory } from '../data/openingStory'
import { loadGameState, saveGameState } from '../state/gameState'

function OpeningStoryScreen() {
  const [opening] = useState(() => {
    const gameState = loadGameState()

    return {
      dialogue: getOpeningStory(gameState),
      lastCompletedMissionId: gameState.lastCompletedMissionId,
    }
  })

  useEffect(() => {
    const gameState = loadGameState()

    if (gameState.activeMissionId !== null) {
      saveGameState({
        ...gameState,
        activeMissionId: null,
      })
    }
  }, [])

  return (
    <SceneLayout backgroundImage="/images/foggyforest.jpg">
      <DialoguePlayer
        key={opening.lastCompletedMissionId ?? 'initial-opening'}
        dialogue={opening.dialogue}
      />
    </SceneLayout>
  )
}

export default OpeningStoryScreen