import { useState } from 'react'
import DialoguePlayer from './DialoguePlayer'
import SceneLayout from './SceneLayout'
import { getOpeningStory } from '../data/openingStory'
import { loadGameState } from '../state/gameState'

function OpeningStoryScreen() {
  const [opening] = useState(() => {
    const gameState = loadGameState()

    return {
      dialogue: getOpeningStory(gameState),
      lastCompletedMissionId: gameState.lastCompletedMissionId,
    }
  })

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