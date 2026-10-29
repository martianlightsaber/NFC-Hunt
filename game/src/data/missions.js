const BAI_WUCHANG_PORTRAIT = '/images/baiwuchang_pfp.png'
const DEFAULT_MISSION_BACKGROUND = '/images/moonlitgarden.jpg'

export const missions = {
  'mission-1': {
    id: 'mission-1',
    title: 'Spirit Beast Inquiry',
    required: true,
    backgroundImage: '/images/foggyforest.jpg',
    collectionToken: 'ae715e6a7105a179ccb87c7203440fd5',
    dialogue: [
      { text: 'You arrive in the forest near your sect.' },
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'Welcome back, Sect Leader!',
      },
      {
        type: 'scan-prompt',
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'A spirit beast has been spotted nearby. Search the area for its trace.',
      },
    ],
    collectible: {
      id: 'spirit-beast-trace',
      name: 'Spirit Beast Trace',
      image: null,
    },
    wrapUpDialogue: [
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'The trace is secured. I will investigate where it leads.',
      },
    ],
  },

  'mission-2': {
    id: 'mission-2',
    title: 'Rogue Cultivator Sighting',
    required: true,
    backgroundImage: DEFAULT_MISSION_BACKGROUND,
    collectionToken: 'd8b291fc4e6307a5ad19c02f8756e341',
    dialogue: [
      { text: 'A strange presence lingers along the old mountain path.' },
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'A rogue cultivator was seen nearby, but no one knows where they went.',
      },
      {
        type: 'scan-prompt',
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'Look for a trace of their passage. Search the area now.',
      },
    ],
    collectible: {
      id: 'rogue-cultivator-trace',
      name: 'Rogue Cultivator Trace',
      image: null,
    },
    wrapUpDialogue: [
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'This trace should reveal which way the cultivator went.',
      },
    ],
  },

  'mission-3': {
    id: 'mission-3',
    title: 'Ghost Gate Seal Leak',
    required: true,
    backgroundImage: DEFAULT_MISSION_BACKGROUND,
    collectionToken: '9f0c63e2a417b5d8c3296e1074fa2b51',
    dialogue: [
      { text: 'A chill wind stirs around a distant gate.' },
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'The Ghost Gate seal is weakening. Something may have escaped.',
      },
      {
        type: 'scan-prompt',
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'Search for a fragment of the damaged seal.',
      },
    ],
    collectible: {
      id: 'ghost-gate-seal-fragment',
      name: 'Ghost Gate Seal Fragment',
      image: null,
    },
    wrapUpDialogue: [
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'This fragment will help us understand how the seal was damaged.',
      },
    ],
  },

  'mission-4': {
    id: 'mission-4',
    title: 'Herb Gathering Request',
    required: true,
    backgroundImage: DEFAULT_MISSION_BACKGROUND,
    collectionToken: '3a7e1d94c82b605f1b39e4a06d5c728f',
    dialogue: [
      { text: 'The forest floor is covered in dew.' },
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'A healer needs a rare herb that grows somewhere nearby.',
      },
      {
        type: 'scan-prompt',
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'Look for a sample of the herb and bring it back.',
      },
    ],
    collectible: {
      id: 'moonlit-herb',
      name: 'Moonlit Herb',
      image: null,
    },
    wrapUpDialogue: [
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'This should be enough for the healer to begin their remedy.',
      },
    ],
  },

  'mission-5': {
    id: 'mission-5',
    title: 'Sect Barrier Crack',
    required: true,
    backgroundImage: DEFAULT_MISSION_BACKGROUND,
    collectionToken: 'c51a8e3f72d406b91e5c2a8f3d714b60',
    dialogue: [
      { text: 'A faint shimmer crosses the sect boundary.' },
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'There is a crack in the barrier. Its source is somewhere nearby.',
      },
      {
        type: 'scan-prompt',
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'Search for a fragment of the barrier’s energy.',
      },
    ],
    collectible: {
      id: 'barrier-energy-fragment',
      name: 'Barrier Energy Fragment',
      image: null,
    },
    wrapUpDialogue: [
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'With this fragment, we can begin repairing the barrier.',
      },
    ],
  },

  'mission-6': {
    id: 'mission-6',
    title: 'The Soul’s Calling',
    required: false,
    backgroundImage: DEFAULT_MISSION_BACKGROUND,
    collectionToken: '7c4e92a1d6b8305f0a3e7d9c2b6148f5',
    dialogue: [
      {
        text: 'As you hold the completed soul, you feel a sudden tug pull through it.',
      },
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'Something is calling to the soul from beyond the booth.',
      },
      {
        type: 'scan-prompt',
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'Follow that pull and search for its source.',
      },
    ],
    collectible: {
      id: 'soul-calling-trace',
      name: 'Soul’s Calling Trace',
      image: null,
    },
    wrapUpDialogue: [
      {
        speaker: 'Bai Wuchang',
        portrait: BAI_WUCHANG_PORTRAIT,
        text: 'We have found a trace of what called to the soul. We must investigate further.',
      },
    ],
  },
}

export const MISSION_IDS = Object.keys(missions)

export const REQUIRED_MISSION_IDS = Object.values(missions)
  .filter((mission) => mission.required)
  .map((mission) => mission.id)

export const MISSION_BY_COLLECTION_TOKEN = Object.fromEntries(
  Object.values(missions).map((mission) => [
    mission.collectionToken,
    mission.id,
  ]),
)