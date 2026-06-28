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

// 🆕 Helper function to show buttons and cleanup interaction states
function revealButtons() {
  const buttonContainer = document.getElementById("button-container");
  if (buttonContainer) {
    buttonContainer.classList.remove("hidden");
    buttonContainer.style.display = "flex"; // 🆕 Forces the buttons to display cleanly as a column
  }
  document.removeEventListener("click", handleScreenTap);
  document.body.style.cursor = "default";
}

// 4. Set up the events when the page loads
window.onload = function() {
  // Start typing the very first line automatically
  typeWriter();
  
  // Listen for clicks/taps anywhere on the screen to trigger the next line
  document.addEventListener("click", handleScreenTap);
};