const cultivatorName = localStorage.getItem('savedName');

// 1. Define story dialogue lines (Supports Narrator voice and Character Speech)
const dialogueLines = [
  // A standard string implies Narrator voice (no name, no portrait)
  { text: "You land in the forest near your sect and notice a fog descending." },
  { text: "You summon your familiar and ask him to brief you on any anomalies in your sect lands while you were away on your mission." },
  
  // Adding "name" and "portrait" automatically formats the box to Character Mode
  { 
    text: "Welcome back Sect Leader " + cultivatorName + "!", 
    name: "Bai Wuchang", 
    portrait: "images/baiwuchang_pfp.png",
  },
  { text: "There has been no major trouble but the spirits have been restless."},
  { text: "These are the requests we received while you were away."},
  { text: "Which one should I arrange for first?", choices: true},
];

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

function initializeElements() {
  backdrop = document.getElementById("backdrop");
  cloudsContainer = document.getElementById("clouds-container");
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

  // Setup choice button clicks
  const buttons = document.querySelectorAll(".choice-btn");
  buttons.forEach(btn => {
    btn.addEventListener("click", handleChoiceClick);
  });
}

// 2. Cinematic Entrance Sequence
function runEntranceSequence() {
  // Step 1: After 1 second, part the clouds
  setSequenceTimeout(() => {
    cloudsContainer.classList.add("parted");
  }, 1000);

  // Step 2: After 2.5 seconds, enable backdrop slow scanning
  setSequenceTimeout(() => {
    backdrop.classList.add("pan-active");
  }, 2500);

  // Step 3: After 5.5 seconds, fade in the dialogue box
  setSequenceTimeout(() => {
    textboxContainer.classList.add("visible");
  }, 5500);

  // Step 4: After 6.3 seconds, transition is done, begin typing
  setSequenceTimeout(() => {
    introFinished = true;
    startLine();
  }, 6300);
}

// Helper to track timeouts so they can be instantly aborted
function setSequenceTimeout(fn, delay) {
  const timer = setTimeout(fn, delay);
  sequenceTimers.push(timer);
}

// Fast forward the cinematic and start text typing immediately
function skipIntro() {
  sequenceTimers.forEach(timer => clearTimeout(timer));
  
  cloudsContainer.classList.add("parted");
  backdrop.classList.add("pan-active");
  textboxContainer.classList.add("visible");
  
  introFinished = true;
  startLine();
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
  
  if (currentCharIndex < fullLineText.length) {
    isTyping = true;
    dialogueText.innerHTML += fullLineText.charAt(currentCharIndex);
    currentCharIndex++;
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
  } else {
    tapIndicator.classList.remove("hidden");
  }
}

// 4. Interactivity Coordinator
function handleGlobalTap() {
  // If choice buttons are visible, ignore all background screen taps
  if (choicesContainer && choicesContainer.classList.contains("visible")) {
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
  window.location.href = "talisman.html";
}

function handleChoiceClick(e) {
  // Prevent click bubbling
  e.stopPropagation();
  
  const choiceId = e.target.getAttribute("data-choice");
  console.log("Selected Choice ID:", choiceId);
  
  // Navigate to next stage with the choice query parameter
  window.location.href = "mission" + choiceId + ".html";
}

// Jumps directly to the final dialogue line + choices, skipping the whole intro
function jumpToChoices() {
  // Cancel any pending entrance timers just in case
  sequenceTimers.forEach(timer => clearTimeout(timer));

  // Snap clouds open instantly, with no transition
  cloudsContainer.classList.add("no-transition");
  cloudsContainer.classList.add("parted");

  // Snap all entrance visuals to their "finished" state instantly
  textboxContainer.classList.add("visible");
  introFinished = true;

  // Jump to the last line in the dialogue array
  currentLineIndex = dialogueLines.length - 1;
  const lineData = dialogueLines[currentLineIndex];

  // Reuse startLine()'s speaker logic, but skip the typewriter effect
  let name = lineData.name;
  let portrait = lineData.portrait;

  if (lineData.narrator) {
    name = ""; portrait = "";
  } else if (!name && !portrait) {
    name = lastSpeakerName; portrait = lastSpeakerPortrait;
  } else {
    lastSpeakerName = name || "";
    lastSpeakerPortrait = portrait || "";
  }

  if (name || portrait) {
    speakerGroup.style.display = "flex";
    textboxContainer.classList.add("has-portrait");
  } else {
    speakerGroup.style.display = "none";
    textboxContainer.classList.remove("has-portrait");
  }

  if (name) {
    nameText.textContent = name;
    nameplate.style.display = "flex";
  } else {
    nameplate.style.display = "none";
  }

  if (portrait) {
    portraitImg.src = portrait;
    characterPortrait.style.display = "block";
  } else {
    characterPortrait.style.display = "none";
  }

  // Show full text immediately, no typing
  dialogueText.innerHTML = lineData.text;
  isTyping = false;
  tapIndicator.classList.add("hidden");

  // Show the choice buttons immediately
  choicesContainer.classList.remove("hidden");
  void choicesContainer.offsetWidth; // Force reflow
  choicesContainer.classList.add("visible");
}

// Page entry point
window.onload = function() {
  initializeElements();
  
  // Check if we should skip straight to the choices screen
  const params = new URLSearchParams(window.location.search);
  if (params.get("skip") === "requests") {
    jumpToChoices();
  } else {
    runEntranceSequence();
  }

  // Listen for taps anywhere on the screen
  document.addEventListener("click", handleGlobalTap);
};