// Elements
const workoutDurationSelect = document.getElementById('workout-duration');
const startWorkoutButton = document.getElementById('start-workout');
const pauseWorkoutButton = document.getElementById('pause-workout');
const instructionDisplay = document.getElementById('instruction');
const timerDisplay = document.getElementById('timer');
const categorySelect = document.getElementById('category');
const customInstructionsContainer = document.getElementById('custom-instructions-container');
const instructionList = document.getElementById('instruction-list');

// Instructions with their corresponding audio files
const offenseInstructions = [
  { name: 'Level Change', audio: 'audio/levelchange.mp3' },
  { name: 'Shoot', audio: 'audio/shoot.mp3' },
  { name: 'Sweep Single', audio: 'audio/sweepsingle.mp3' },
  { name: 'Circle', audio: 'audio/circle.mp3' },
  { name: 'Foot Fire', audio: 'audio/footfire.mp3' }
];

const defenseInstructions = [
  { name: 'Sprawl', audio: 'audio/sprawl.mp3' },
  { name: 'Level Change', audio: 'audio/levelchange.mp3' },
  { name: 'Circle', audio: 'audio/circle.mp3' },
  { name: 'Downblock Left', audio: 'audio/downblockleft.mp3' },
  { name: 'Downblock Right', audio: 'audio/downblockright.mp3' },
  { name: 'Foot Fire', audio: 'audio/footfire.mp3' },
  { name: 'Pepsi', audio: 'audio/pepsi.mp3' }
];

const bottomInstructions = [
  { name: 'Tripod', audio: 'audio/tripod.mp3' },
  { name: 'Inside Stand Up', audio: 'audio/insidestandup.mp3' },
  { name: 'Petersons', audio: 'audio/petersons.mp3' },
  { name: 'Sitout', audio: 'audio/sitout.mp3' }
];

// Combine all instructions for the Custom category
const allInstructions = [...offenseInstructions, ...defenseInstructions, ...bottomInstructions];

// Timer variables
let timerInterval;
let instructionInterval;
let secondsRemaining;
let selectedCategory;
let isPaused = false;
let selectedInstructions = [];

// Function to reset the workout state
function resetWorkout() {
  clearInterval(timerInterval);
  clearInterval(instructionInterval);
  isPaused = false;
  secondsRemaining = 0;
  instructionDisplay.textContent = 'Press Start to Begin';
  timerDisplay.textContent = '0:00';
  pauseWorkoutButton.disabled = true;
  pauseWorkoutButton.textContent = 'Pause Workout';
}

// Function to get a random instruction from the selected category
function getRandomInstruction() {
  let instructions;
  if (selectedCategory === 'offense') {
    instructions = offenseInstructions;
  } else if (selectedCategory === 'defense') {
    instructions = defenseInstructions;
  } else if (selectedCategory === 'bottom') {
    instructions = bottomInstructions;
  } else if (selectedCategory === 'custom') {
    instructions = selectedInstructions;
  }
  if (!instructions || instructions.length === 0) {
    return { name: 'No Instructions Selected', audio: '' };
  }
  const randomIndex = Math.floor(Math.random() * instructions.length);
  return instructions[randomIndex];
}

// Function to update the timer display
function updateTimerDisplay() {
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  timerDisplay.textContent = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}

// Function to start a new workout
function startWorkout() {
  if (isPaused) {
    // Resume the paused workout
    isPaused = false;
    pauseWorkoutButton.textContent = 'Pause Workout';
    runWorkoutTimer();
    runInstructionInterval();
    return;
  }

  // Reset the workout before starting a new one
  resetWorkout();

  // Change button text to "New Workout" and enable pause
  startWorkoutButton.textContent = 'New Workout';
  pauseWorkoutButton.disabled = false;

  // Get the workout duration and category
  const workoutDuration = parseInt(workoutDurationSelect.value);
  secondsRemaining = workoutDuration * 60;
  selectedCategory = categorySelect.value;

  // Validate custom category
  if (selectedCategory === 'custom' && selectedInstructions.length === 0) {
    alert('Please select at least one instruction for the Custom category.');
    startWorkoutButton.textContent = 'Start Workout';
    return;
  }

  // Start the timer and instructions
  runWorkoutTimer();
  runInstructionInterval();
}

// Function to pause the workout
function pauseWorkout() {
  if (isPaused) {
    isPaused = false;
    pauseWorkoutButton.textContent = 'Pause Workout';
    runWorkoutTimer();
    runInstructionInterval();
  } else {
    isPaused = true;
    clearInterval(timerInterval);
    clearInterval(instructionInterval);
    pauseWorkoutButton.textContent = 'Resume Workout';
    instructionDisplay.textContent = 'Workout Paused';
  }
}

// Function to run the workout timer
function runWorkoutTimer() {
  timerInterval = setInterval(() => {
    if (!isPaused) {
      updateTimerDisplay();
      secondsRemaining--;

      if (secondsRemaining < 0) {
        clearInterval(timerInterval);
        clearInterval(instructionInterval);
        instructionDisplay.textContent = 'Workout Complete!';
        new Audio('audio/whistle.mp3').play();
        startWorkoutButton.textContent = 'Start Workout';
        pauseWorkoutButton.disabled = true;
        return;
      }
    }
  }, 1000);
}

// Function to run the instruction interval
function runInstructionInterval() {
  instructionInterval = setInterval(() => {
    if (!isPaused) {
      const randomInstruction = getRandomInstruction();
      instructionDisplay.textContent = randomInstruction.name;
      new Audio(randomInstruction.audio).play();
    }
  }, 5000);
}

// Function to render the list of instructions for the Custom category
function renderInstructionList() {
  instructionList.innerHTML = '';
  allInstructions.forEach((instruction, index) => {
    const button = document.createElement('button');
    button.textContent = instruction.name;
    button.classList.add('instruction-button');
    button.addEventListener('click', () => toggleInstructionSelection(index));
    instructionList.appendChild(button);
  });
}

// Function to toggle instruction selection for the Custom category
function toggleInstructionSelection(index) {
  const instruction = allInstructions[index];
  const button = instructionList.children[index];

  if (selectedInstructions.includes(instruction)) {
    selectedInstructions = selectedInstructions.filter((item) => item !== instruction);
    button.classList.remove('selected');
  } else {
    selectedInstructions.push(instruction);
    button.classList.add('selected');
  }
}

// Event listener for category change
categorySelect.addEventListener('change', () => {
  if (categorySelect.value === 'custom') {
    customInstructionsContainer.style.display = 'block';
    renderInstructionList();
  } else {
    customInstructionsContainer.style.display = 'none';
  }
});

// ✅ **Fix for "New Workout" Not Working**
startWorkoutButton.addEventListener('click', () => {
  console.log("Start/New Workout Clicked");  // Debugging
  resetWorkout();
  startWorkout();
});

// Pause button listener
pauseWorkoutButton.addEventListener('click', pauseWorkout);
