// >>> REPLACE ENTIRE FILE: game/src/data/openingStory.js
import {
  missions,
  REQUIRED_MISSION_IDS,
} from './missions'

const BAI_WUCHANG_PORTRAIT = '/images/baiwuchang_pfp.png'
const MOS_OFFICER_PORTRAIT = '/images/mos-officer.png'

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
  {text: [
    {text: 'Where... am I?', italic: true},
  ],
  },
  {text: [
    {text: 'What is this floating flame?', italic: true},
  ],
  },
  {
    speaker: '???',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "You're finally awake!!",
  },
  {text: [
    {text: "It spoke!!  ", italic: true },
    {text: '"Oh, uhm, hello? Who are you? And where am I?"'},
  ],
  },
  {
    speaker: '???',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "I'm an officer from the Ministry of Souls, or MOS for short. The MOS monitors and manages all souls in the world.",
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "My apologies for appearing before you like this, but my form is hazy on All Hallow's Eve when the barrier between the worlds of the living and dead grows thin.",
  },
  {text: [
    {text: "MOS sounds familiar... like I'd heard it in a dream...", italic: true},
  ],
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "My lady, a thousand years have passed since your soul was shattered in the Soulrift Catastrophe where you stood against the forces of the Heavenly Realm.",
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "One piece of your soul remained within you, but the rest have been scattered across the winds for a millenium.",
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "Your body has been hibernating, biding its time for when the pieces of your soul find their way back to you.",
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "The MOS has worked tirelessly to locate your remaining soul fragments. This All Hallow's Eve, fortune smiles upon us!",
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "Your soul fragments have gained their own spiritual powers and personalities over the years, and today are all gathered on a small island on Earth called 'Singapore'.",
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "You only have today to round them up before they scatter once more, so make haste!",
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "I will guide you to their last known locations, but once there, you will need to find them yourself.",
  },
  {text: [
    {text: "During the MOS officer's explanation, I notice I am holding on to a smooth black rectangular item. The friendly officer seems to have noticed me puzzling over it.", italic: true},
  ],
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "This is a newly developed MOS Soulhunter 3.0 device! Like the qiankun pouches of old, but capable of not just storing but also assimilating souls!",
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "Whenever you find your soul fragments' new forms, hold the top of the Soulhunter near them and it will extract the necessary essence to reform your soul.",
  },
  {text: [
    {text: "I nod confidently, as though I understood his spiel. Oh well, I'm sure I'll figure it out along the way.", italic: true},
  ],
  },
  {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: "If you're ready, these are the 5 places your soul fragments were last seen. Pick your first target and I will transport you there!",
  },
]

function createInitialMissionSelection(gameState) {
  return {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: 'Which location do you want to investigate first?',
    choices: getMissionChoices(gameState),
  }
}

function createRemainingMissionSelection(gameState, remainingCount) {
  const fragmentWord = remainingCount === 1 ? 'fragment' : 'fragments'

  return {
    speaker: 'MOS Officer',
    portrait: MOS_OFFICER_PORTRAIT,
    text: `You still need ${remainingCount} more soul ${fragmentWord}. Where would you like to search next?`,
    choices: getMissionChoices(gameState),
  }
}

function createFiveMissionEnding() {
  return [
    {
      speaker: 'MOS Officer',
      portrait: MOS_OFFICER_PORTRAIT,
      text: 'Congratulations! You have collected all five soul fragments!',
    },
    {
      type: 'fragment-fusion',
      collectibles: REQUIRED_MISSION_IDS.map(
        (missionId) => missions[missionId].collectible,
      ),
    },
    {
      speaker: 'MOS Officer',
      portrait: MOS_OFFICER_PORTRAIT,
      text: 'The completed soul feels whole and steady at last.',
    },
    {
      type: 'final-instructions',
      speaker: 'MOS Officer',
      portrait: MOS_OFFICER_PORTRAIT,
      text: 'Approach the spiritual healers at the booth to ensure your soul is complete.',
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
          speaker: 'MOS Officer',
          portrait: MOS_OFFICER_PORTRAIT,
          text: `Congratulations on successfully finding your soul fragment at ${completedMission.title}!`,
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