export const missions = {
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
}