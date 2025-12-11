/* ========================================
   SLEDEX LOGISTICS - JAVASCRIPT LOGIC
   ======================================== */

// Constants
const TRACKING_CODE = "SOFT-404";
const LOADING_DURATION = 10000; // 10 seconds in milliseconds
const STATUS_MESSAGE_INTERVAL = 3300; // ~3.3 seconds

// DOM Elements
const trackingCodeInput = document.getElementById("tracking-code");
const loginBtn = document.getElementById("login-btn");
const errorMsg = document.getElementById("error-msg");
const phase1 = document.getElementById("phase-1");
const phase2 = document.getElementById("phase-2");
const phase3 = document.getElementById("phase-3");
const progressBar = document.getElementById("progress-bar");
const loadingStatus = document.getElementById("loading-status");

// Status messages
const statusMessages = [
  "Manók ébresztése és adatbázis kapcsolása...",
  "Kasmír-puhaság index ellenőrzése (100%)...",
  "Szán útvonaltervezés a megadott címre...",
];

// ========================================
// PHASE 1: LOGIN FUNCTIONALITY
// ========================================

loginBtn.addEventListener("click", handleLogin);
trackingCodeInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
});

function handleLogin() {
  const input = trackingCodeInput.value.trim().toUpperCase();

  // Clear previous error
  errorMsg.textContent = "";
  errorMsg.classList.remove("show");

  // Validate input
  if (!input) {
    showError("Kérjük, adja meg a szállítási kódot!");
    return;
  }

  if (input !== TRACKING_CODE) {
    showError("Hibás szállítási kód. Próbálja meg újra!");
    return;
  }

  // Success - transition to loading phase
  transitionPhase(phase1, phase2);
  startLoadingPhase();
}

function showError(message) {
  errorMsg.textContent = message;
  errorMsg.classList.add("show");
}

// ========================================
// PHASE 2: LOADING EXPERIENCE
// ========================================

function startLoadingPhase() {
  const startTime = Date.now();
  let messageIndex = 0;

  // Progress bar animation (0% to 100% over 10 seconds)
  const progressInterval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = (elapsed / LOADING_DURATION) * 100;

    progressBar.style.width = Math.min(progress, 100) + "%";

    if (elapsed >= LOADING_DURATION) {
      clearInterval(progressInterval);
      progressBar.style.width = "100%";

      // Transition to dashboard after a small delay
      setTimeout(() => {
        transitionPhase(phase2, phase3);
      }, 300);
    }
  }, 30); // Update every 30ms for smooth animation

  // Status message rotation (every ~3.3 seconds)
  let statusMessageStartTime = Date.now();
  const statusMessageInterval = setInterval(() => {
    const elapsed = Date.now() - statusMessageStartTime;

    if (elapsed >= STATUS_MESSAGE_INTERVAL) {
      messageIndex = (messageIndex + 1) % statusMessages.length;
      loadingStatus.style.opacity = "0";

      setTimeout(() => {
        loadingStatus.textContent = statusMessages[messageIndex];
        loadingStatus.style.opacity = "1";
      }, 200);

      statusMessageStartTime = Date.now();
    }
  }, 100);

  // Clear interval when loading is complete
  setTimeout(() => {
    clearInterval(statusMessageInterval);
  }, LOADING_DURATION);
}

// ========================================
// PHASE TRANSITIONS
// ========================================

function transitionPhase(fromPhase, toPhase) {
  // Fade out current phase
  fromPhase.classList.remove("active");

  // Fade in new phase
  setTimeout(() => {
    toPhase.classList.add("active");
  }, 50);
}

// ========================================
// INITIALIZATION
// ========================================

document.addEventListener("DOMContentLoaded", () => {
  // Set initial progress bar width
  progressBar.style.width = "0%";

  // Focus on input field
  trackingCodeInput.focus();

  // Initialize first status message
  loadingStatus.textContent = statusMessages[0];
});
