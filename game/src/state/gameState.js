const STORAGE_KEY = 'nfc-hunt-save'
const SAVE_VERSION = 1

export const REQUIRED_MISSION_IDS = [
  'mission-1',
  'mission-2',
  'mission-3',
  'mission-4',
  'mission-5',
]

const ALL_MISSION_IDS = [
  'opening',
  ...REQUIRED_MISSION_IDS,
  'mission-6',
]

export function areRequiredMissionsComplete(gameState) {
  return REQUIRED_MISSION_IDS.every((missionId) => {
    const progress = gameState?.missions?.[missionId]

    return (
      progress?.itemCollected === true &&
      progress?.storyWrapped === true
    )
  })
}

export function createInitialGameState() {
  return {
    version: SAVE_VERSION,
    playerCategory: null,
    ticketNumber: null,
    playerName: null,
    missions: Object.fromEntries(
      ALL_MISSION_IDS.map((missionId) => [
        missionId,
        {
          lineIndex: 0,
          itemCollected: false,
          storyWrapped: false,
          collectionRevealSeen: false,
        },
      ]),
    ),
    lastCompletedMissionId: null,
    mission6Unlocked: false,
    completionInstructionsSeen: false,
    finalInstructionsSeen: false,
  }
}

function isValidGameState(state) {
  return (
    state !== null &&
    typeof state === 'object' &&
    state.version === SAVE_VERSION &&
    (state.playerCategory === null ||
      state.playerCategory === 'regular' ||
      state.playerCategory === 'add-on') &&
    (state.ticketNumber === null || typeof state.ticketNumber === 'string') &&
    (state.playerName === null || typeof state.playerName === 'string') &&
    state.missions !== null &&
    (state.lastCompletedMissionId === null ||
    ALL_MISSION_IDS.includes(state.lastCompletedMissionId)) &&
    typeof state.missions === 'object' &&
    typeof state.mission6Unlocked === 'boolean' &&
    typeof state.completionInstructionsSeen === 'boolean' &&
    typeof state.finalInstructionsSeen === 'boolean' &&
    ALL_MISSION_IDS.every((missionId) => {
      const mission = state.missions[missionId]

      return (
        mission !== null &&
        typeof mission === 'object' &&
        Number.isInteger(mission.lineIndex) &&
        mission.lineIndex >= 0 &&
        typeof mission.itemCollected === 'boolean' &&
        typeof mission.storyWrapped === 'boolean' &&
        typeof mission.collectionRevealSeen === 'boolean' 
      )
    })
  )
}

export function loadGameState() {
  const savedState = window.localStorage.getItem(STORAGE_KEY)

  if (savedState === null) {
    return createInitialGameState()
  }

  const parsedState = JSON.parse(savedState)
  let migrated = false

  if (
    parsedState?.version === SAVE_VERSION &&
    parsedState.missions &&
    !parsedState.missions.opening
  ) {
    parsedState.missions.opening = {
      lineIndex: 0,
      itemCollected: false,
      storyWrapped: false,
    }
    migrated = true
  }

  if (
    parsedState?.version === SAVE_VERSION &&
    parsedState.playerName === undefined
  ) {
    parsedState.playerName = null
    migrated = true
  }

  if (parsedState?.version === SAVE_VERSION && parsedState.missions) {
    for (const missionId of ALL_MISSION_IDS) {
      const mission = parsedState.missions[missionId]

      if (
        mission &&
        typeof mission === 'object' &&
        mission.collectionRevealSeen === undefined
      ) {
        mission.collectionRevealSeen = false
        migrated = true
      }
    }
  }

  if (
    parsedState?.version === SAVE_VERSION &&
    parsedState.lastCompletedMissionId === undefined
  ) {
    parsedState.lastCompletedMissionId = null
    migrated = true
  }

  if (!isValidGameState(parsedState)) {
    throw new Error(
      'The saved game data is invalid or from an unsupported version.',
    )
  }

  if (migrated) {
    saveGameState(parsedState)
  }

  return parsedState
}

export function saveGameState(state) {
  if (!isValidGameState(state)) {
    throw new Error('Cannot save invalid game data.')
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function clearGameState() {
  window.localStorage.removeItem(STORAGE_KEY)
}