// >>> REPLACE ENTIRE FILE: game/src/state/gameState.js
import {
  MISSION_IDS,
  REQUIRED_MISSION_IDS,
  missions,
} from '../data/missions'

const STORAGE_KEY = 'nfc-hunt-save'
const SAVE_VERSION = 4

const OPENING_CURSOR_PHASES = new Set([
  'opening-introduction',
  'mission-selection',
  'mission-congratulations',
  'five-mission-ending',
  'five-mission-booth',
  'mission-6-terminal',
])

export { REQUIRED_MISSION_IDS }

export function areRequiredMissionsComplete(gameState) {
  return REQUIRED_MISSION_IDS.every((missionId) => {
    const progress = gameState?.missions?.[missionId]

    return (
      progress?.itemCollected === true &&
      progress?.storyWrapped === true
    )
  })
}

function createMissionProgress() {
  return {
    collectionScanReady: false,
    itemCollected: false,
    storyWrapped: false,
    collectionRevealSeen: false,
  }
}

export function createInitialGameState() {
  return {
    version: SAVE_VERSION,
    playerCategory: null,
    ticketNumber: null,
    playerName: null,
    missions: Object.fromEntries(
      MISSION_IDS.map((missionId) => [
        missionId,
        createMissionProgress(),
      ]),
    ),
    activeMissionId: null,
    lastCompletedMissionId: null,
    mission6Unlocked: false,
    completionInstructionsSeen: false,
    finalInstructionsSeen: false,
    finalInstructionsActive: false,
    dialogueCursor: null,
    pendingMissionCongratulationsId: null,
    openingIntroSeen: false,
  }
}

function isValidDialogueCursor(cursor) {
  if (cursor === null) return true

  if (
    cursor === null ||
    typeof cursor !== 'object' ||
    !Number.isInteger(cursor.lineIndex) ||
    cursor.lineIndex < 0
  ) {
    return false
  }

  if (cursor.screen === 'opening') {
    return OPENING_CURSOR_PHASES.has(cursor.phase)
  }

  if (cursor.screen === 'mission') {
    return (
      MISSION_IDS.includes(cursor.missionId) &&
      ['mission', 'wrap-up', 'mission-6-ending'].includes(cursor.phase)
    )
  }

  return false
}

function migrateLegacyState(state) {
  if (
    state === null ||
    typeof state !== 'object' ||
    ![1, 2, 3].includes(state.version)
  ) {
    return state
  }

  const migratedMissions = Object.fromEntries(
    MISSION_IDS.map((missionId) => {
      const previous = state.missions?.[missionId] ?? {}
      const scanPromptIndex =
        missions[missionId].dialogue.findIndex(
          (line) => line.type === 'scan-prompt',
        )
      const wasAtLegacyScanPrompt =
        state.version === 1 &&
        state.activeMissionId === missionId &&
        previous.lineIndex === scanPromptIndex

      return [
        missionId,
        {
          collectionScanReady:
            previous.collectionScanReady === true ||
            (wasAtLegacyScanPrompt &&
              previous.itemCollected !== true &&
              previous.storyWrapped !== true),
          itemCollected: previous.itemCollected === true,
          storyWrapped: previous.storyWrapped === true,
          collectionRevealSeen:
            previous.collectionRevealSeen === true,
        },
      ]
    }),
  )

  const hasCompletedMission = Object.values(migratedMissions).some(
    (progress) => progress.storyWrapped,
  )

  return {
    ...createInitialGameState(),
    ...state,
    version: SAVE_VERSION,
    missions: migratedMissions,
    activeMissionId: MISSION_IDS.includes(state.activeMissionId)
      ? state.activeMissionId
      : null,
    lastCompletedMissionId: MISSION_IDS.includes(
      state.lastCompletedMissionId,
    )
      ? state.lastCompletedMissionId
      : null,
    mission6Unlocked: state.mission6Unlocked === true,
    completionInstructionsSeen:
      state.completionInstructionsSeen === true,
    finalInstructionsSeen: state.finalInstructionsSeen === true,
    finalInstructionsActive: state.finalInstructionsActive === true,
    dialogueCursor: null,
    pendingMissionCongratulationsId: null,
    openingIntroSeen:
      typeof state.openingIntroSeen === 'boolean'
        ? state.openingIntroSeen
        : Boolean(
            state.activeMissionId ||
              state.lastCompletedMissionId ||
              hasCompletedMission,
          ),
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
    typeof state.missions === 'object' &&
    (state.activeMissionId === null ||
      MISSION_IDS.includes(state.activeMissionId)) &&
    (state.lastCompletedMissionId === null ||
      MISSION_IDS.includes(state.lastCompletedMissionId)) &&
    (state.pendingMissionCongratulationsId === null ||
      MISSION_IDS.includes(state.pendingMissionCongratulationsId)) &&
    typeof state.mission6Unlocked === 'boolean' &&
    typeof state.completionInstructionsSeen === 'boolean' &&
    typeof state.finalInstructionsSeen === 'boolean' &&
    typeof state.finalInstructionsActive === 'boolean' &&
    typeof state.openingIntroSeen === 'boolean' &&
    isValidDialogueCursor(state.dialogueCursor) &&
    MISSION_IDS.every((missionId) => {
      const progress = state.missions[missionId]

      return (
        progress !== null &&
        typeof progress === 'object' &&
        typeof progress.collectionScanReady === 'boolean' &&
        typeof progress.itemCollected === 'boolean' &&
        typeof progress.storyWrapped === 'boolean' &&
        typeof progress.collectionRevealSeen === 'boolean'
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
  const gameState =
    parsedState?.version === SAVE_VERSION
      ? parsedState
      : migrateLegacyState(parsedState)

  if (!isValidGameState(gameState)) {
    throw new Error(
      'The saved game data is invalid or from an unsupported version.',
    )
  }

  if (gameState !== parsedState) {
    saveGameState(gameState)
  }

  return gameState
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
// <<< END REPLACEMENT