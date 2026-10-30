const BAI_WUCHANG_PORTRAIT = '/images/baiwuchang_pfp.png'
const MOS_OFFICER_PORTRAIT = '/images/mos-officer.png'
const XAVIER_PORTRAIT = '/images/xavier_pfp.png'
const ZAYNE_PORTRAIT = '/images/zayne_pfp.png'
const RAFAYEL_PORTRAIT = '/images/rafayel_pfp.png'
const SYLUS_PORTRAIT = '/images/sylus_pfp.png'
const CALEB_PORTRAIT = '/images/caleb_pfp.png'
const VALKO_PORTRAIT = '/images/valko_pfp.png'
const DEFAULT_MISSION_BACKGROUND = '/images/moonlitgarden.jpg'

export const missions = {
  'mission-1': {
    id: 'mission-1',
    title: 'Gardens by the Bay',
    required: true,
    backgroundImage: '/images/supertree.png',
    collectionToken: 'ae715e6a7105a179ccb87c7203440fd5',
    dialogue: [
      { text: [{text: 'These are some crazy tall and weird trees... it will take me all day just to find this one soul fragment in such a forest!', italic: true},], },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'My Lady! Our intel suggests that this soul fragment prefers peace and quiet, the loud music and bright lights in this grove make it unlikely for it to be here.',
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: [{text: 'It will most likely be resting near the '},
               {text: 'base of a green tree ', bold: true},
               {text: 'in the cooled dome the mortals call "Cloud Forest".'},],
      },
      { text: [{text: "I've been searching near the bases of trees for some time no-... wait who's snoring?", italic: true},], },
      { text: 'My scrutiny seems to have awakened the little rabbit spirit, and he yawns and rubs his eyes sleepily.', 
        centerImage: '/images/xavier.png',
      },
      { text: [{text: "...Xavier? ", italic: true},
               {text: "The name comes unbidden to my mind."},], 
      },
      {
        speaker: 'Xavier',
        portrait: XAVIER_PORTRAIT,
        text: 'What took you so long? I ended up taking the longest nap because I spent so long waiting for you.',
      },
      { text: 'Xavier holds out a talisman and looks at me expectantly.' },
      {
        type: 'scan-prompt',
        speaker: 'Xavier',
        portrait: XAVIER_PORTRAIT,
        text: "I kept the essence of your soul bound to this talisman for safekeeping. Go on, hold your Soulhunter to my talisman and retrieve what's yours.",
      },
    ],
    collectible: {
      id: 'xavier-trace',
      name: 'Xavier',
      image: '/images/xavier_talisman.png',
    },
    wrapUpDialogue: [
      {
        speaker: 'Xavier',
        portrait: XAVIER_PORTRAIT,
        text: "Your soul has helped me cultivate from a lowly bunny to the spirit I am today. If you ever need me, use incense sticks and the talisman to call me.",
        centerImage: '/images/xavier.png',
      },
      {
        speaker: 'Xavier',
        portrait: XAVIER_PORTRAIT,
        text: "I will find you from whichever tree or vegetable garden I may be napping in.",

      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'My Lady, it is as though you are a soulmate of the Jade Rabbit!',
        dismissCenterImage: true,
      },
    ],
  },

  'mission-2': {
    id: 'mission-2',
    title: 'Thian Hock Keng Temple',
    required: true,
    backgroundImage: '/images/temple.png',
    collectionToken: 'd8b291fc4e6307a5ad19c02f8756e341',
    dialogue: [
      { text: [{text: "I wasn't expecting the temples to still look the same after a thousand years, but it's nice to see a small piece of home.", italic: true},], },
      { text: [{text: "I should pay my respects to the dieties for giving me this second chance at life.", italic: true},], },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'My Lady, the deities here protect travellers, and you have travelled far in space and time.',
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'I need to depart for an errand, please take your time to heal in the spiritual essence of this place for a while, the day is yet young.',
      },
      { text: 'I wander past the altars of the various deities, taking in the rich aroma of incense and offerings.' },
      { text: [{text: "Is that... "},
               {text: "a pile of sweets???", bold: true},], 
      },
      { text: [{text: "Deities' taste in offerings sure have changed over the last thousand years...", italic: true}],},
      { text: 'Suddenly, I hear the tablecloth rustle near my feet. Curious, I bend down to look underneath.' },
      { text: 'A big pair of serious golden eyes looks back at me, and I startle back.' },
      { text: [{text: "A tiny Jiangshi!!!", italic: true}],},
      { text: [{text: "What is a Jiangshi doing in a temple?", italic: true}],},
      {
        speaker: '???',
        portrait: ZAYNE_PORTRAIT,
        text: 'Hello, my name is Zayne. Are you here to pray for healing?',
        centerImage: '/images/zayne.png',
      },
      { text: "'Healing? But you're a Jiangshi'" },
      { text: [{text: "Nevertheless, amidst my confusion, the name 'Zayne' brings a sense of calm that's both new and familiar at once.", italic: true}],},
      {
        speaker: 'Zayne',
        portrait: ZAYNE_PORTRAIT,
        text: 'Yes, the principles which revive us also revive others. This era is plentiful in sweets, but low in knowledge of the ancient arts. It is a fair exchange.'
      },
      { text: "As we speak, he unwraps a candy and savors it, continuing to eye me critically. After what feels like a minute of staring, he speaks." },
      {
        speaker: 'Zayne',
        portrait: ZAYNE_PORTRAIT,
        text: [{text: 'I can sense that your '},
               {text: 'qi ', italic: true},
               {text: 'is incomplete. It turns out I have just the thing for you.'},]
      },
      { text: "With a half-millimeter smile, he produces a talisman which glows with the power of a soul fragment." },
      {
        type: 'scan-prompt',
        speaker: 'Zayne',
        portrait: ZAYNE_PORTRAIT,
        text: 'I am glad to see you again, my Goddess. You must reclaim your full power at once. Please touch your Soulhunter to this talisman.'
      },
    ],
    collectible: {
      id: 'rogue-cultivator-trace',
      name: 'Rogue Cultivator Trace',
      image: '/images/zayne_talisman.png',
    },
    wrapUpDialogue: [
      {
        speaker: 'Zayne',
        portrait: ZAYNE_PORTRAIT,
        text: "Much better. I will see you back here for regular check-ups. Bring that talisman, and the appropriate offerings. No carrot cakes.",
        centerImage: '/images/zayne.png',
      },
      { text: "With business settled, he returns to his spot under the table, which turns out to hide a large library of tomes.",
        dismissCenterImage: true,
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: "I have returned! It looks like my Lady has the heart of a healer.",

      },
    ],
  },

  'mission-3': {
    id: 'mission-3',
    title: 'National Museum',
    required: true,
    backgroundImage: DEFAULT_MISSION_BACKGROUND,
    collectionToken: '9f0c63e2a417b5d8c3296e1074fa2b51',
    dialogue: [
      { text: 'A chill wind stirs around a distant gate.' },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'The Ghost Gate seal is weakening. Something may have escaped.',
      },
      {
        type: 'scan-prompt',
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
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
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'This fragment will help us understand how the seal was damaged.',
      },
    ],
  },

  'mission-4': {
    id: 'mission-4',
    title: 'Raffles Hotel',
    required: true,
    backgroundImage: DEFAULT_MISSION_BACKGROUND,
    collectionToken: '3a7e1d94c82b605f1b39e4a06d5c728f',
    dialogue: [
      { text: 'The forest floor is covered in dew.' },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'A healer needs a rare herb that grows somewhere nearby.',
      },
      {
        type: 'scan-prompt',
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
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
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'This should be enough for the healer to begin their remedy.',
      },
    ],
  },

  'mission-5': {
    id: 'mission-5',
    title: 'Singapore Flyer',
    required: true,
    backgroundImage: DEFAULT_MISSION_BACKGROUND,
    collectionToken: 'c51a8e3f72d406b91e5c2a8f3d714b60',
    dialogue: [
      { text: 'A faint shimmer crosses the sect boundary.' },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'There is a crack in the barrier. Its source is somewhere nearby.',
      },
      {
        type: 'scan-prompt',
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
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
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
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
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'Something is calling to the soul from beyond the booth.',
      },
      {
        type: 'scan-prompt',
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
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
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
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