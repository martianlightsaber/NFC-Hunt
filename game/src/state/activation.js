// >>> REPLACE ENTIRE FILE: game/src/state/activation.js
import { ADD_ON_BOOTH_TOKEN } from '../data/collectionTokens'
import {
  MISSION_BY_COLLECTION_TOKEN,
  REQUIRED_MISSION_IDS,
} from '../data/missions'

const CATEGORY_BY_TOKEN = {
  '65a9c1c6475536fc21f3055beeb94083': 'regular',
  '294392927ed521485b7d20e394f4f046': 'add-on',
}

export const IRRELEVANT_TOKEN_WARNING =
  'This interaction is not relevant to this mission'

export const PREMATURE_TOKEN_WARNING =
  'Please finish the dialogue before scanning.'

function areAllRequiredMissionsComplete(gameState) {
  return REQUIRED_MISSION_IDS.every((missionId) => {
    const progress = gameState.missions[missionId]

    return (
      progress?.itemCollected === true &&
      progress?.storyWrapped === true
    )
  })
}

function isAtFiveMissionBoothPrompt(gameState) {
  return (
    gameState.dialogueCursor?.screen === 'opening' &&
    gameState.dialogueCursor.phase === 'five-mission-booth'
  )
}

function isAtMissionSixFinalLine(gameState) {
  return (
    gameState.dialogueCursor?.screen === 'mission' &&
    gameState.dialogueCursor.missionId === 'mission-6' &&
    gameState.dialogueCursor.phase === 'mission-6-ending'
  )
}

export function resolveTokenActivation(gameState, token, routeKind) {
  const mission6Progress = gameState.missions['mission-6']
  const allRequiredComplete = areAllRequiredMissionsComplete(gameState)

  if (
    mission6Progress?.storyWrapped === true ||
    isAtMissionSixFinalLine(gameState)
  ) {
    return { kind: 'silent' }
  }

  if (
    gameState.playerCategory === 'regular' &&
    routeKind === 'booth'
  ) {
    return { kind: 'silent' }
  }

  if (
    gameState.playerCategory === 'regular' &&
    allRequiredComplete &&
    isAtFiveMissionBoothPrompt(gameState)
  ) {
    return { kind: 'silent' }
  }

  if (routeKind === 'bootstrap') {
    const category = CATEGORY_BY_TOKEN[token]

    return category
      ? { kind: 'resume', category }
      : { kind: 'irrelevant' }
  }

  if (routeKind === 'collect') {
    const missionId = MISSION_BY_COLLECTION_TOKEN[token]

    if (!missionId) return { kind: 'irrelevant' }

    const progress = gameState.missions[missionId]
    const missionIsAvailable =
      missionId !== 'mission-6' ||
      (gameState.playerCategory === 'add-on' &&
        gameState.mission6Unlocked &&
        allRequiredComplete)

if (
  missionIsAvailable &&
  gameState.activeMissionId === missionId &&
  progress?.itemCollected &&
  !progress.storyWrapped &&
  !progress.collectionRevealSeen
) {
  return { kind: 'silent' }
}

    if (
      !missionIsAvailable ||
      gameState.activeMissionId !== missionId ||
      !progress ||
      progress.itemCollected ||
      progress.storyWrapped
    ) {
      return { kind: 'irrelevant' }
    }

    return progress.collectionScanReady
      ? { kind: 'collect', missionId }
      : { kind: 'premature', missionId }
  }

  if (routeKind === 'booth' && token === ADD_ON_BOOTH_TOKEN) {
    const canStartMission6 =
      gameState.playerCategory === 'add-on' &&
      gameState.activeMissionId === null &&
      allRequiredComplete &&
      isAtFiveMissionBoothPrompt(gameState) &&
      mission6Progress?.storyWrapped !== true

    return canStartMission6
      ? { kind: 'start-mission-6' }
      : { kind: 'irrelevant' }
  }

  return { kind: 'irrelevant' }
}
// <<< END REPLACEMENT