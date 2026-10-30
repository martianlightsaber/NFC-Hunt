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
      id: 'zayne-trace',
      name: 'Zayne',
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
    backgroundImage: '/images/odyssea.png',
    collectionToken: '9f0c63e2a417b5d8c3296e1074fa2b51',
    dialogue: [
      { text: [{text: "What a riot of sound and color! My old teachers would be so jealous that 'bringing history to life' has become reality. I did always sleep through their classes...", italic: true},], },
      { text: "When I learned that this soul fragment was in a history museum, I expected it to be the elegant and cultured part of myself, but I'm starting to have my doubts." },
      { text: "A group of children (and some adults) jump around the undersea replica environment, watching ripples form and fish swim by." },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'My Lady, quick! Follow the red fish!',
      },
      { text: [{text: "I turn to see a flash of red disappear around the corner and bolt after it, but find nothing around the corner, just a " },
                {text: "series of shelves stocked with art and merchandise.", bold: true},]
      },
      { text: "Suddenly, a yell comes from above me just as I find myself with a faceful of fluffy rust-red fur." },
      {
        speaker: '???',
        portrait: RAFAYEL_PORTRAIT,
        text: 'I was just taking Reddie for a swim and lost my grip!',
        centerImage: '/images/rafayel.png',
      },
      { text: "The little ball of fur in my arms pouts in embarrassment as I slowly set him down on a bench." },
      { text: "He is especially fashionable, even for a nine-tailed fox, with a stylized 'Rafayel' emblazoned across his lapels." },
      { text: [{text: "His name is probably Rafayel... let's poke him a little bit.", italic: true},], },
      { text: [{text: "'So, Rafayel, you... fell off the "},
               {text: "high wall art installation", bold:true },
               {text: "? What were you doing up there anyway?'" },],
      },
      {
        speaker: 'Rafayel',
        portrait: RAFAYEL_PORTRAIT,
        text: "Miss guardian angel! You remember me after all? I've been waiting 800 years...",
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: "Actually it's been 1000 years",
      },
      {
        speaker: 'Rafayel',
        portrait: RAFAYEL_PORTRAIT,
        text: [{text: "Details schmetails. ", italic: true},
               {text: "Miss guardian angel has a beautiful and artistic soul, I have treasured it these eigh- one thousand years."}],
      },
      {
        speaker: 'Rafayel',
        portrait: RAFAYEL_PORTRAIT,
        text: "But it's time to give it back now.",
      },
      {
        type: 'scan-prompt',
        speaker: 'Rafayel',
        portrait: RAFAYEL_PORTRAIT,
        text: 'This talisman is a symbol of our connection, keep it safe in your Soulhunter.',
      },
    ],
    collectible: {
      id: 'rafayel-trace',
      name: 'Rafayel',
      image: '/images/rafayel_talisman.png',
    },
    wrapUpDialogue: [
      {
        speaker: 'Rafayel',
        portrait: RAFAYEL_PORTRAIT,
        text: "Summon me any time Miss guardian angel! Catch ya later!",
        dismissCenterImage: true,
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: "This officer is glad to see that you have such a free spirit My Lady. The powers of imagination will no doubt speed your soul's recovery.",
      },
    ],
  },

  'mission-4': {
    id: 'mission-4',
    title: 'Raffles Hotel',
    required: true,
    backgroundImage: '/images/hotel.png',
    collectionToken: '3a7e1d94c82b605f1b39e4a06d5c728f',
    dialogue: [
      { text: [{text: "The lilting notes of an instrument drift across the hall from the second storey drawing room, its sound both like and unlike any "},
               {text: "qin ", italic: true},
               {text: "I had ever heard."},
      ], },
      { text: "'Officer Sprite, what is that instrument?'" },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: [{text: "It is called a "},
               {text: "piano ", bold: true},
               {text: "my Lady."},
      ],
      },
      { text: "The music draws me to it, and before long, I hear the sharp notes of the percussive strings accompanied by low, mellow vocals." },
      { text: [{text: "Is the singing meant to be of a different pitch from the instrument? Perhaps music styles have changed over time...", italic: true},], },
      { text: [{text: "Approaching from behind the large wooden lid of the "},
               {text: "piano", bold: true},
               {text: ", I find that there is no musician seated there."},
      ], },
      { text: "Only a hint of reddish-black tendrils of smoke across the instrument's surface, making the tune feel more ghostly than it sounded." },
      { text: "My shoe snags on a rug and abruptly the music stops, the silence suddenly deafening." },
      {
        speaker: '???',
        portrait: SYLUS_PORTRAIT,
        text: "Hello sweetie.",
      },
      { text: [{text: "How did they get behind me?!", italic: true},], },
      { text: [{text: "The presence over my shoulder narrowly avoids my silver throwing needle, and lazily settles his tiny form on the lid of the "},
               {text: "piano", bold:true},
               {text: ", dragon tail lightly swinging against the wood."},], 
        centerImage: '/images/sylus.png',},
      { text: [{text: "Sylus", italic:true},
               {text: ", my soul supplies, as my spiritual aura fights against his for dominance."},], },
      {
        speaker: 'Sylus',
        portrait: SYLUS_PORTRAIT,
        text: "Your hunting instincts are as sharp as ever, kitten. Though that is to be expected, as we are of one soul.",
      },
      {
        speaker: 'Sylus',
        portrait: SYLUS_PORTRAIT,
        text: "You want the soul back? You'll have to come and get it.",
      },
      { text: "He smirks playfully, waving a talisman imbued with the power of a soul fragment as we tussle until I eventually emerge victorious." },
      {
        type: 'scan-prompt',
        text: "I let the Soulhunter absorb the soul fragment's power while I inspect the unusual talisman.",
      },
    ],
    collectible: {
      id: 'sylus-trace',
      name: 'Sylus',
      image: '/images/sylus_talisman.png',
    },
    wrapUpDialogue: [
      {
        speaker: 'Sylus',
        portrait: SYLUS_PORTRAIT,
        text: "That's the black unlimited-use talisman sweetie, use it to summon me any time, as much as you want.",
        centerImage: '/images/sylus.png',
      },
      { text: "'Officer Sprite? He's gone, you can come out now!'",
        dismissCenterImage: true,
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'My Lady, I knew you were a hero on the battlefield, but remind me never to get on your bad side...',
      },
    ],
  },

  'mission-5': {
    id: 'mission-5',
    title: 'Singapore Flyer',
    required: true,
    backgroundImage: '/images/flyer.png',
    collectionToken: 'c51a8e3f72d406b91e5c2a8f3d714b60',
    dialogue: [
      { text: [{text: "It's. So. HIGH! I'd never been able to enjoy a relaxing view from this high up before. The bustle of the futuristic city looks so small from up here.", italic: true},], },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'My Lady, you have chosen a tricky soul fragment to track.',
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'Our records show that it has been detected roaming both the skies above and the ground below unhindered.',
      },
      { text: "'And yet, Officer Sprite, this one somehow feels like it has never been apart, always watching over me.'" },
      { text: [{text: "I continue gazing out of the brightly-lit clear capsule, feeling like a "},
               {text: "lantern swinging high above the ground.", bold: true},], },
      { text: "I turn to face the Officer, only to find the view in front of me blocked by a very large, very bare chest.",
        centerImage: '/images/caleb.png',
       },
      { text: [{text: "!!!!", italic: true},], },
      { text: [{text: "This armour, this physique... it is unmistakably Caleb, lord of the Netherworld. Also, Officer Sprite's boss.", italic: true},], },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'My Lord!!',
      },
      { text: "'Aren't you Caleb, lord of the Netherworld? What are you doing so high up?", },
      { text: "He shrugs and gives me a gentle smile.", },
      {
        speaker: 'Caleb',
        portrait: CALEB_PORTRAIT,
        text: "I've been been searching for you for a long time.",
      },
      {
        speaker: 'Caleb',
        portrait: CALEB_PORTRAIT,
        text: "It recently occurred to me that being up here would give me a birdseye view of the ground so it'll be easier for me to find you. Guess it worked!",
      },
      {
        type: 'scan-prompt',
        text: 'He hands me a talisman containing my soul fragment and watches as I absorb it through the Soulhunter',
      },
    ],
    collectible: {
      id: 'caleb-trace',
      name: 'Caleb',
      image: '/images/caleb_talisman.png',
    },
    wrapUpDialogue: [
      {
        speaker: 'Caleb',
        portrait: CALEB_PORTRAIT,
        text: "You won't have to find me again as long as you have this talisman. Use it anytime and I'll appear right by your side, even if it's only for something small like braiding your hair.",
        centerImage: '/images/caleb.png',
      },
      { text: "He disappears in a whirl of shadows, but despite the lingering coldness, my soul feels surprisingly warm.",
        dismissCenterImage: true,
      },
      { text: "Officer Sprite, despite being just a floating ball of flame, looks like he has a thousand questions to ask about my relationship with his boss.", },
      { text: "I'm not sure even I can answer them.", },
    ],
  },

  'mission-6': {
    id: 'mission-6',
    title: 'The Trapped Soul',
    required: false,
    backgroundImage: "/images/sg_skyline.png",
    collectionToken: '7c4e92a1d6b8305f0a3e7d9c2b6148f5',
    dialogue: [
      {
        text: [{text: "The healers are happy that your soul will heal well. Just as you're getting ready to absorb your newly-collected soul fragments, you feel an inexorable ",},
                {text: "tug.", italic:true},],
      },
      {
        text: [{text: "I don't think this is part of the normal soul healing process. We should find out what it's trying to tell us.", italic:true},],
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'I see you sense it as well. We should investigate.',
      },
      { text: "As we follow the tugs on the soul, they get more insistent. Perhaps, more hopeful." },
      { text: "We find ourselves at the Night Safari, navigating the quiet trails of tropical mammals.",
        backgroundImage: '/images/nightsafari.png',
      },
      {
        text: [{text: "I think I hear howling. It's faint, but unquestionably in the direction of the pull on my soul.", italic:true},],
      },
      { text: "There is a faint presence at the spot where the tugging stops." },
      { text: [{text: "It is an abandoned storage shed, "},
        {text: "furniture covered in cloths and layered with spider webs.", bold:true},], },      
      { text: "Officer Sprite and I pour mana in its direction and slowly, a ghostly figure flickers into existence. He seems to have trouble speaking.",
        centerImage: '/images/valko-trapped.png',
      },
      {
        speaker: '???',
        portrait: VALKO_PORTRAIT,
        text: "You're... really here? I've been... imprisoned here for so long... I was going to give up. Thank you for rescuing me.",
      },
      { text: "He seems to grow weaker even as we pour more mana into him. He slowly starts losing his form." },
      {
        type: 'scan-prompt',
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: "Quick! Store his soul in the Soulhunter and we'll bring him to the healers.",
      },
    ],
    collectible: {
      id: 'valko-trace',
      name: 'Trapped Soul',
      image: '/images/willowisp-green.png',
    },
    wrapUpDialogue: [
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'Let us make haste and return him to the Ministry healers.',
      },
      {
        speaker: 'MOS Officer',
        portrait: MOS_OFFICER_PORTRAIT,
        text: 'He will need a shrine and the prayer of devotees to replenish his spiritual essence, or he risks fading away forever.',
      },
      { text: "(Return to the Event Prize Booth)" },
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