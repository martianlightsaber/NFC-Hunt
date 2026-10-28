import { missions } from './missions'
import { REQUIRED_MISSION_IDS } from '../state/gameState'

const missionSelectionLine = {
  speaker: 'Bai Wuchang',
  portrait: '/images/baiwuchang_pfp.png',
  text: 'Which one should I arrange for first?',
  choices: [
    { id: 'mission-1', label: 'Spirit Beast Inquiry' },
    { id: 'mission-2', label: 'Rogue Cultivator Sighting' },
    { id: 'mission-3', label: 'Ghost Gate Seal Leak' },
    { id: 'mission-4', label: 'Herb Gathering Request' },
    { id: 'mission-5', label: 'Sect Barrier Crack' },
  ],
}

function getMissionChoices(gameState) {
  return missionSelectionLine.choices.map((choice) => ({
    ...choice,
    disabled: gameState.missions[choice.id]?.storyWrapped === true,
  }))
}

export const openingStory = [
  {
    text: 'You land in the forest near your sect and notice a fog descending.',
  },
  {
    text: 'You summon your familiar and ask him to brief you on any anomalies in your sect lands while you were away on your mission.',
  },
  {
    speaker: 'Bai Wuchang',
    portrait: '/images/baiwuchang_pfp.png',
    text: 'Welcome back, Sect Leader!',
  },
  {
    speaker: 'Bai Wuchang',
    portrait: '/images/baiwuchang_pfp.png',
    text: 'There has been no major trouble, but the spirits have been restless.',
  },
  {
    speaker: 'Bai Wuchang',
    portrait: '/images/baiwuchang_pfp.png',
    text: 'These are the requests we received while you were away.',
  },
  missionSelectionLine,
]

export function getOpeningStory(gameState) {
  const lastCompletedMissionId = gameState.lastCompletedMissionId
  const choices = getMissionChoices(gameState)

  const completedCount = REQUIRED_MISSION_IDS.filter(
    (missionId) => gameState.missions[missionId].storyWrapped,
  ).length
  const remainingCount = REQUIRED_MISSION_IDS.length - completedCount
  const fragmentWord = remainingCount === 1 ? 'fragment' : 'fragments'

  const finalEndingDialogue = [
    {
      speaker: 'Bai Wuchang',
      portrait: '/images/baiwuchang_pfp.png',
      text: 'The completed soul feels whole and steady at last.',
    },
    {
      type: 'final-instructions',
      speaker: 'Bai Wuchang',
      portrait: '/images/baiwuchang_pfp.png',
      text: 'Bring the completed soul to the event booth for spiritual healing.',
    },
  ]

  if (completedCount === REQUIRED_MISSION_IDS.length) {
    if (gameState.completionInstructionsSeen) {
      return gameState.finalInstructionsActive
        ? [finalEndingDialogue.find((line) => line.type === 'final-instructions')]
        : finalEndingDialogue
    }

    return [
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
        text: 'Congratulations! You have collected all five spirit fragments!',
      },
      {
        type: 'fragment-fusion',
        collectibles: REQUIRED_MISSION_IDS.map(
          (missionId) => missions[missionId].collectible,
        ),
      },
      ...finalEndingDialogue,
    ]
  }

  const remainingMissionsLine = {
    speaker: 'Bai Wuchang',
    portrait: '/images/baiwuchang_pfp.png',
    text: `You still need ${remainingCount} more spirit ${fragmentWord}. Where would you like to search next?`,
    choices,
  }

  if (gameState.activeMissionId) {
    return [remainingMissionsLine]
  }

  if (!lastCompletedMissionId) {
    return openingStory.map((line, index) =>
      index === openingStory.length - 1
        ? { ...line, choices }
        : line,
    )
  }

  const completedMission = missions[lastCompletedMissionId]

  return [
    {
      speaker: 'Bai Wuchang',
      portrait: '/images/baiwuchang_pfp.png',
      text: `Congratulations on completing ${completedMission.title}!`,
    },
    remainingMissionsLine,
  ]
}
