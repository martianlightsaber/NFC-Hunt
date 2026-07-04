const cultivatorName = localStorage.getItem('savedName');

// 1. Define story dialogue lines (Supports Narrator voice and Character Speech)
const dialogueLines = [
  // A standard string implies Narrator voice (no name, no portrait)
  { text: "You arrive at the gardens to find Rabbit God Xavier snoozing under the full moon." },
  
  // Adding "name" and "portrait" automatically formats the box to Character Mode
  { 
    text: "Tu'er Ye, Master " + cultivatorName + " is back! Wake up!", 
    name: "Bai Wuchang", 
    portrait: "images/baiwuchang_pfp.png",
  },
  { 
    text: "Zzz...", 
    name: "Xavier", 
    portrait: "images/xavier_pfp.png",
  },
  { text: "Hmm? Oh... welcome back " + cultivatorName + "! Your mission must have gone well."},
  { text: "You tell Xavier about your infiltration of the 109 Dark Realms.", narrator: true},
  { 
    text: "I knew you'd have no trouble in the Dark Realms.", 
    name: "Xavier", 
    portrait: "images/xavier_pfp.png",
  },
  { text: "You are one of the most capable Sect Leaders of this epoch."},
  { text: "Xavier nods approvingly with a smile.", narrator: true},
  { text: "He doesn't volunteer any more information, so you look at him curiously."},
  { 
    text: "Tu'er Ye, you said you had a probem that you wanted Master " + cultivatorName + " to look into?", 
    name: "Bai Wuchang", 
    portrait: "images/baiwuchang_pfp.png",
  },
  { 
    text: "...oh that's right.", 
    name: "Xavier", 
    portrait: "images/xavier_pfp.png",
  },
  { text: "While you were away the Jade Rabbits have been visiting the garden."},
  { text: "But I haven't seen Puffball in some time."},
  { text: "I think we should go look for him.", choices: true},
    { 
    text: "Let's go look around the <b>booths at the marketplace</b>.", 
    name: "Xavier", 
    portrait: "images/xavier_pfp.png",
    hint: true
  },
  //{ text: "Which one should I arrange for first?", choices: true},
];

const hintLines = 'Look for the <b>booths selling merchandise within the cafe</b> - you might find Puffball the bunny lurking there! When you find him, hold your phone up to him to "collect" his spirit and return him to Xavier.'

let currentLineIndex = 0;
let currentCharIndex = 0;
let typingTimer = null;
const typingSpeed = 35; // delay between characters in ms
let isTyping = false;
let introFinished = false;

// Dialogue state tracking variables
let lastSpeakerName = "";
let lastSpeakerPortrait = "";

// Handles timing sequence timeouts so they can be cleared on skip
let sequenceTimers = [];

// DOM Elements
let backdrop, cloudsContainer, textboxContainer, dialogueText, tapIndicator;
let characterPortrait, portraitImg, nameplate, nameText;
let speakerGroup;
let choicesContainer;
let hintContainer, hintText;

function initializeElements() {
  backdrop = document.getElementById("backdrop");
  //cloudsContainer = document.getElementById("clouds-container");
  textboxContainer = document.getElementById("textbox-container");
  dialogueText = document.getElementById("dialogue-text");
  tapIndicator = document.getElementById("tap-indicator");

  // Character Speech elements
  characterPortrait = document.getElementById("character-portrait");
  portraitImg = document.getElementById("portrait-img");
  nameplate = document.getElementById("nameplate");
  nameText = document.getElementById("name-text");
  speakerGroup = document.getElementById("speaker-group");

  choicesContainer = document.getElementById("choices-container");

  hintContainer = document.getElementById("hint-container");
  hintText = document.getElementById("hint-text");

  // Setup choice button clicks
  const buttons = document.querySelectorAll(".choice-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", handleChoiceClick);
  });
}

// 2. Cinematic Entrance Sequence
function runEntranceSequence() {

  // Step 1: After 1 seconds, fade in the dialogue box
  setSequenceTimeout(() => {
    textboxContainer.classList.add("visible");
  }, 500);

  // Step 2: After 2 seconds, transition is done, begin typing
  setSequenceTimeout(() => {
    introFinished = true;
    startLine();
  }, 1500);
}

// Helper to track timeouts so they can be instantly aborted
function setSequenceTimeout(fn, delay) {
  const timer = setTimeout(fn, delay);
  sequenceTimers.push(timer);
}

// Fast forward the cinematic and start text typing immediately
function skipIntro() {
  sequenceTimers.forEach(timer => clearTimeout(timer));
  
  //cloudsContainer.classList.add("parted");
  //backdrop.classList.add("pan-active");
  textboxContainer.classList.add("visible");
  
  introFinished = true;
  startLine();
}

// Counts only the visible (non-tag) characters in an HTML string
function getVisibleTextLength(html) {
  const temp = document.createElement("div");
  temp.innerHTML = html;
  return temp.textContent.length;
}

// Rebuilds valid HTML showing only the first `count` visible characters,
// auto-closing any tags that are "open" at that cutoff point
function getRevealedHTML(container, remaining) {
  let html = "";
  for (const node of container.childNodes) {
    if (remaining.count <= 0) break;

    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (text.length <= remaining.count) {
        html += text;
        remaining.count -= text.length;
      } else {
        html += text.slice(0, remaining.count);
        remaining.count = 0;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const tagName = node.tagName.toLowerCase();
      html += `<${tagName}>`;
      html += getRevealedHTML(node, remaining);
      html += `</${tagName}>`;
    }
  }
  return html;
}

// 3. Typewriter Dialogue Engine
function startLine() {
  const lineData = dialogueLines[currentLineIndex];
  
  // 1. Determine active speaker (carry over from last line or clear if narration)
  let name = lineData.name;
  let portrait = lineData.portrait;
  
  if (lineData.narrator) {
    // Explicitly switch back to narrator mode
    lastSpeakerName = "";
    lastSpeakerPortrait = "";
    name = "";
    portrait = "";
  } else if (!name && !portrait) {
    // No new speaker defined, carry over from last line
    name = lastSpeakerName;
    portrait = lastSpeakerPortrait;
  } else {
    // New speaker defined, save it
    lastSpeakerName = name || "";
    lastSpeakerPortrait = portrait || "";
  }
  // 2. Toggle Speaker Group visibility & spacing class
  if (name || portrait) {
    speakerGroup.style.display = "flex";
    textboxContainer.classList.add("has-portrait");
  } else {
    speakerGroup.style.display = "none";
    textboxContainer.classList.remove("has-portrait");
  }
  // 3. Configure Nameplate
  if (name) {
    nameText.textContent = name;
    nameplate.style.display = "flex";
  } else {
    nameplate.style.display = "none";
  }
  // 4. Configure Portrait
  if (portrait) {
    portraitImg.src = portrait;
    characterPortrait.style.display = "block";
  } else {
    characterPortrait.style.display = "none";
  }
  dialogueText.innerHTML = "";
  currentCharIndex = 0;
  tapIndicator.classList.add("hidden");
  typeCharacter();
}

function typeCharacter() {
  const lineData = dialogueLines[currentLineIndex];
  const fullLineText = lineData.text;
  const visibleLength = getVisibleTextLength(fullLineText);
  
  if (currentCharIndex < visibleLength) {
    isTyping = true;
    currentCharIndex++;

    const parsed = document.createElement("div");
    parsed.innerHTML = fullLineText;
    dialogueText.innerHTML = getRevealedHTML(parsed, { count: currentCharIndex });

    typingTimer = setTimeout(typeCharacter, typingSpeed);
  } else {
    finishLine();
  }
}

function finishLine() {
  isTyping = false;
  const lineData = dialogueLines[currentLineIndex];
  dialogueText.innerHTML = lineData.text; // safety guarantee
  clearTimeout(typingTimer);
  
  // If this line has choices, show them and suppress the tap indicator
  if (lineData.choices) {
    choicesContainer.classList.remove("hidden");
    void choicesContainer.offsetWidth; // Force reflow
    choicesContainer.classList.add("visible");
  }

  if (lineData.hint) {
    hintText.innerHTML = hintLines;
    hintContainer.classList.remove("hidden");
    void hintContainer.offsetWidth; // Force reflow
    hintContainer.classList.add("visible");
  } 
  
  else {
    tapIndicator.classList.remove("hidden");
  }
}

// 4. Interactivity Coordinator
function handleGlobalTap() {
  // If choice buttons are visible, ignore all background screen taps
  if (choicesContainer && choicesContainer.classList.contains("visible")) {
    return;
  }

  // If hint box is visible, ignore all background screen taps
  if (hintContainer && hintContainer.classList.contains("visible")) {
    return;
  }

  // If the opening cinematic is still running, skip it
  if (!introFinished) {
    skipIntro();
    return;
  }

  // If text is typing, finish it instantly
  if (isTyping) {
    finishLine();
    return;
  }

  // If we have more dialogue, advance to the next line
  if (currentLineIndex < dialogueLines.length - 1) {
    currentLineIndex++;
    startLine();
  } else {
    // End of dialogue sequence - transition to your scavenger hunt stage
    handleDialogueEnd();
  }
}

function handleDialogueEnd() {
  // Redirect to the first hunt stage (talisman.html)
  // You can customize this target file or action as needed.
  //hintText.textContent = hintLines;
  //hintContainer.classList.remove("hidden");
  //void hintContainer.offsetWidth; // Force reflow
  //hintContainer.classList.add("visible");
}

function handleChoiceClick(e) {
  // Prevent click bubbling
  e.stopPropagation();
  
  const choiceId = e.target.getAttribute("data-choice");
  console.log("Selected Choice ID:", choiceId);
  
  // Navigate to next stage with the choice query parameter
  //window.location.href = "talisman.html?choice=" + choiceId;
    // If we have more dialogue, advance to the next line
  choicesContainer.classList.remove("visible");
  void choicesContainer.offsetWidth; // Force reflow
  choicesContainer.classList.add("hidden");
  if (currentLineIndex < dialogueLines.length - 1) {
    currentLineIndex++;
    startLine();
  } else {
    // End of dialogue sequence 
    handleDialogueEnd();
  }
}

// Page entry point
window.onload = function() {
  initializeElements();
  runEntranceSequence();

  // Listen for taps anywhere on the screen
  document.addEventListener("click", handleGlobalTap);

  // Prevent the back link from also triggering dialogue advance
  const backLink = document.getElementById("back-link");
  if (backLink) {
    backLink.addEventListener("click", (e) => e.stopPropagation());
  }
};