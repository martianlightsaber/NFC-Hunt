export const missions = {

  //------------//
  // MISSION #1 //
  //------------//

  'mission-1': {
    title: 'Spirit Beast Inquiry',

    // Dialogue shown before the player taps the mission's NFC token.
    dialogue: [
      { text: 'You arrive in the forest near your sect.' },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
        text: 'Welcome back, Sect Leader!',
      },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
        text: 'A spirit beast has been spotted nearby. Search the area for its trace.',
      },
    ],

    // Placeholder metadata; the artwork can be chosen later.
    collectible: {
      id: 'spirit-beast-trace',
      name: 'Spirit Beast Trace',
      image: null,
    },

    // Dialogue to show after the item has been collected.
    wrapUpDialogue: [
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
        text: 'The trace is secured. I will investigate where it leads.',
      },
    ],
  },

  //------------//
  // MISSION #2 //
  //------------//

    'mission-2': {
    title: 'Rogue Cultivator Sighting',
    backgroundImage: '/images/moonlitgarden.jpg',
    dialogue: [
      { text: 'A strange presence lingers along the old mountain path.' },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
        text: 'A rogue cultivator was seen nearby, but no one knows where they went.',
      },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
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
        portrait: '/images/baiwuchang_pfp.png',
        text: 'This trace should reveal which way the cultivator went.',
      },
    ],
  },

  //------------//
  // MISSION #3 //
  //------------//

  'mission-3': {
    title: 'Ghost Gate Seal Leak',
    backgroundImage: '/images/moonlitgarden.jpg',
    dialogue: [
      { text: 'A chill wind stirs around a distant gate.' },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
        text: 'The Ghost Gate seal is weakening. Something may have escaped.',
      },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
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
        portrait: '/images/baiwuchang_pfp.png',
        text: 'This fragment will help us understand how the seal was damaged.',
      },
    ],
  },

  //------------//
  // MISSION #4 //
  //------------//

  'mission-4': {
    title: 'Herb Gathering Request',
    backgroundImage: '/images/moonlitgarden.jpg',
    dialogue: [
      { text: 'The forest floor is covered in dew.' },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
        text: 'A healer needs a rare herb that grows somewhere nearby.',
      },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
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
        portrait: '/images/baiwuchang_pfp.png',
        text: 'This should be enough for the healer to begin their remedy.',
      },
    ],
  },

  //------------//
  // MISSION #5 //
  //------------//

  'mission-5': {
    title: 'Sect Barrier Crack',
    backgroundImage: '/images/moonlitgarden.jpg',
    dialogue: [
      { text: 'A faint shimmer crosses the sect boundary.' },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
        text: 'There is a crack in the barrier. Its source is somewhere nearby.',
      },
      {
        speaker: 'Bai Wuchang',
        portrait: '/images/baiwuchang_pfp.png',
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
        portrait: '/images/baiwuchang_pfp.png',
        text: 'With this fragment, we can begin repairing the barrier.',
      },
    ],
  },
}