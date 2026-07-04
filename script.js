// 1. Store your dialogue strings in an array
const dialogueLines = [
  "Welcome Miss Hunter to Wang Chuan Tech Pte. Ltd.!",
  "I am OTTO-MENGPO, your guide for today's VR experience.",
  "Today we will visit the Spirit Realm and lend a hand to some troubled spirits!",
  "Are you ready?"
];

let currentLineIndex = 0;
let currentCharIndex = 0;
let typingTimer = null;
const typingSpeed = 50; // Delay between letters in milliseconds
let isTyping = false;

// 2. The core typewriter function
function typeWriter() {
  const textElement = document.getElementById("typing-text");
  const tapPrompt = document.getElementById("tap-prompt");
  const fullText = dialogueLines[currentLineIndex];

  if (currentCharIndex < fullText.length) {
    isTyping = true;
    textElement.innerHTML += fullText.charAt(currentCharIndex);
    currentCharIndex++;
    typingTimer = setTimeout(typeWriter, typingSpeed);
  } else {
    isTyping = false;
    
    if (currentLineIndex === dialogueLines.length - 1) {
      tapPrompt.classList.add("hidden");
      revealButtons(); // 🆕 Reveal buttons when final text finishes naturally
    } else {
      tapPrompt.classList.remove("hidden");
    }
  }
}

// 3. Function to handle screen taps / clicks
function handleScreenTap() {
  const textElement = document.getElementById("typing-text");
  const tapPrompt = document.getElementById("tap-prompt");
  const fullText = dialogueLines[currentLineIndex];

  if (isTyping) {
    clearTimeout(typingTimer);
    textElement.innerHTML = fullText;
    isTyping = false;
    currentCharIndex = fullText.length;
    
    if (currentLineIndex === dialogueLines.length - 1) {
      tapPrompt.classList.add("hidden");
      revealButtons(); // 🆕 Reveal buttons if the final sentence is text-skipped
    } else {
      tapPrompt.classList.remove("hidden");
    }
    return;
  }

  if (currentLineIndex >= dialogueLines.length - 1) {
    return; // Safety fallback
  }

  tapPrompt.classList.add("hidden");
  currentLineIndex++;
  currentCharIndex = 0;
  textElement.innerHTML = "";
  typeWriter();
}

// Helper function to show buttons and cleanup interaction states
function revealButtons() {
  const buttonContainer = document.getElementById("button-container");
  if (buttonContainer) {
    buttonContainer.classList.remove("hidden");
    buttonContainer.style.display = "flex"; // Forces the buttons to display cleanly as a column
  }
  document.removeEventListener("click", handleScreenTap);
  document.body.style.cursor = "default";

  // Once the fields/button are visible, wire up the gating logic
  setupEntryGate();
}

// Requires both "Cultivator Name" and "Ticket Number" to be filled in
// before the ENTER button becomes clickable.
function setupEntryGate() {
  const nameInput = document.getElementById("cultivator-name");
  const ticketInput = document.getElementById("ticket-number");
  const enterBtn = document.getElementById("enter-btn");
  const errorMsg = document.getElementById("entry-error");

  if (!nameInput || !ticketInput || !enterBtn) return;

  function fieldsAreValid() {
    return nameInput.value.trim().length > 0 && ticketInput.value.trim().length > 0;
  }

  function refreshButtonState() {
    if (fieldsAreValid()) {
      enterBtn.classList.remove("is-disabled");
      // Hide the error once the user has fixed the fields
      if (errorMsg) errorMsg.classList.remove("visible");
    } else {
      enterBtn.classList.add("is-disabled");
    }
  }

  // Re-check every time either field changes
  nameInput.addEventListener("input", refreshButtonState);
  ticketInput.addEventListener("input", refreshButtonState);

  // Stop taps on the input fields from bubbling up to handleScreenTap
  nameInput.addEventListener("click", (e) => e.stopPropagation());
  ticketInput.addEventListener("click", (e) => e.stopPropagation());

  // Belt-and-suspenders: block navigation if somehow clicked while invalid
  enterBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!fieldsAreValid()) {
      e.preventDefault();
      // Show the "fields required" error message
      if (errorMsg) errorMsg.classList.add("visible");
      return;
    }
    // Placeholder: values are captured here for later use.
    // (What to do with these two fields will be defined later.)
    const cultivatorName = nameInput.value.trim();
    const ticketNumber = ticketInput.value.trim();
    localStorage.setItem('savedName', cultivatorName);
  });

  // Set initial state in case fields are pre-filled somehow
  refreshButtonState();
}

// 4. Set up the events when the page loads
window.onload = function() {
  // Start typing the very first line automatically
  typeWriter();
  
  // Listen for clicks/taps anywhere on the screen to trigger the next line
  document.addEventListener("click", handleScreenTap);
};