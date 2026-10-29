// >>> REPLACE ENTIRE FILE: game/src/data/openingStory.js
import {
  missions,
  REQUIRED_MISSION_IDS,
} from './missions'

const BAI_WUCHANG_PORTRAIT = '/images/baiwuchang_pfp.png'

function getMissionChoices(gameState) {
  return REQUIRED_MISSION_IDS.map((missionId) => {
    const mission = missions[missionId]

    return {
      id: mission.id,
      label: mission.title,
      disabled: gameState.missions[mission.id]?.storyWrapped === true,
    }
  })
}

const openingStoryBeforeChoices = [
  {
    text: 'You land in the forest near your sect and notice a fog descending.',
  },
  {
    text: 'You summon your familiar and ask him to brief you on any anomalies in your sect lands while you were away on your mission.',
  },
  {
    speaker: 'Bai Wuchang',
    portrait: BAI_WUCHANG_PORTRAIT,
    text: 'Welcome back, Sect Leader!',
  },
  {
    speaker: 'Bai Wuchang',
    portrait: BAI_WUCHANG_PORTRAIT,
    text: 'There has been no major trouble, but the spirits have been restless.',
  },
  {
    speaker: 'Bai Wuchang',
    portrait: BAI_WUCHANG_PORTRAIT,
    text: 'These are the requests we received while you were away.',
  },
]

function createInitialMissionSelection(gameState) {
  return {
    speaker: 'Bai Wuchang',
    portrait: BAI_WUCHANG_PORTRAIT,
    text: 'Which one should I arrange for first?',
    choices: getMissionChoices(gameState),
  }
}

function createRemainingMissionSelection(gameState, remainingCount) {
  const fragmentWord = remainingCount === 1 ? 'fragment' : 'fragments'

  return {
    speaker: 'Bai Wuchang',
    portrait: BAI_WUCHANG_PORTRAIT,
    text: `You still need ${remainingCount} more spirit ${fragmentWord}. Where would you like to search next?`,
    choices: getMissionChoices(gameState),
  }
}

function createFiveMissionEnding() {
  return [
    {
      speaker: 'Bai Wuchang',
      portrait: BAI_WUCHANG_PORTRAIT,
      text: 'Congratulations! You have collected all five spirit fragments!',
    },
    {
      type: 'fragment-fusion',
      collectibles: REQUIRED_MISSION_IDS.map(
        (missionId) => missions[missionId].collectible,
      ),
    },
    {
      speaker: 'Bai Wuchang',
      portrait: BAI_WUCHANG_PORTRAIT,
      text: 'The completed soul feels whole and steady at last.',
    },
    {
      type: 'final-instructions',
      speaker: 'Bai Wuchang',
      portrait: BAI_WUCHANG_PORTRAIT,
      text: 'Bring the completed soul to the event booth for spiritual healing.',
    },
  ]
}

export function getOpeningFlow(gameState) {
  const mission6 = gameState.missions['mission-6']

  if (mission6?.storyWrapped) {
    const terminalLine =
      missions['mission-6'].wrapUpDialogue[
        missions['mission-6'].wrapUpDialogue.length - 1
      ]

    return {
      phase: 'mission-6-terminal',
      dialogue: [{ ...terminalLine, type: 'mission-6-terminal' }],
    }
  }

  const completedCount = REQUIRED_MISSION_IDS.filter(
    (missionId) => gameState.missions[missionId].storyWrapped,
  ).length
  const remainingCount = REQUIRED_MISSION_IDS.length - completedCount
  const allRequiredComplete =
    completedCount === REQUIRED_MISSION_IDS.length

  if (gameState.pendingMissionCongratulationsId) {
    const completedMission =
      missions[gameState.pendingMissionCongratulationsId]

    if (!completedMission) {
      throw new Error(
        `Mission data is missing for ${gameState.pendingMissionCongratulationsId}.`,
      )
    }

    return {
      phase: 'mission-congratulations',
      dialogue: [
        {
          type: 'mission-complete-notice',
          speaker: 'Bai Wuchang',
          portrait: BAI_WUCHANG_PORTRAIT,
          text: `Congratulations for completing ${completedMission.title}!`,
        },
        ...(allRequiredComplete
          ? createFiveMissionEnding()
          : [createRemainingMissionSelection(gameState, remainingCount)]),
      ],
    }
  }

  if (allRequiredComplete) {
    if (gameState.completionInstructionsSeen) {
      const ending = createFiveMissionEnding().slice(-2)

      return {
        phase: gameState.finalInstructionsActive
          ? 'five-mission-booth'
          : 'five-mission-ending',
        dialogue: gameState.finalInstructionsActive
          ? [ending[1]]
          : ending,
      }
    }

    return {
      phase: 'five-mission-ending',
      dialogue: createFiveMissionEnding(),
    }
  }

  if (!gameState.openingIntroSeen) {
    return {
      phase: 'opening-introduction',
      dialogue: [
        ...openingStoryBeforeChoices,
        createInitialMissionSelection(gameState),
      ],
    }
  }

  return {
    phase: 'mission-selection',
    dialogue: [
      createRemainingMissionSelection(gameState, remainingCount),
    ],
  }
}

export function getOpeningStory(gameState) {
  return getOpeningFlow(gameState).dialogue
}
// <<< END REPLACEMENT