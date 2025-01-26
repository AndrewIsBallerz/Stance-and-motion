// script.js

// Elements
const workoutDurationSelect = document.getElementById('workout-duration');
const startWorkoutButton = document.getElementById('start-workout');
const instructionDisplay = document.getElementById('instruction');
const timerDisplay = document.getElementById('timer');
const categorySelect = document.getElementById('category');

// Offense, Defense, and Bottom Instructions with their corresponding audio files
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

// Timer variables
let timerInterval;
let instructionInterval;
let secondsRemaining;
let selectedCategory;

// Function to get a random instruction from the selected category
function getRandomInstruction() {
  let instructions;
  if (selectedCategory === 'offense') {
    instructions = offenseInstructions;
  } else if (selectedCategory === 'defense') {
    instructions = defenseInstructions;
  } else if (selectedCategory === 'bottom') {
    instructions = bottomInstructions;
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

// Function to start the workout
function startWorkout() {
  // Disable the button to prevent multiple clicks
  startWorkoutButton.disabled = true;
  
  // Get the workout duration
  const workoutDuration = parseInt(workoutDurationSelect.value);
  secondsRemaining = workoutDuration * 60;
  selectedCategory = categorySelect.value; // Get the selected category (offense, defense, or bottom)

  // Start the timer
  timerInterval = setInterval(() => {
    updateTimerDisplay();
    secondsRemaining--;
    
    // Stop the timer when it reaches 0
    if (secondsRemaining < 0) {
      clearInterval(timerInterval);
      clearInterval(instructionInterval); // Stop the instruction interval when the workout ends
      instructionDisplay.textContent = 'Workout Complete!';
      
      // Play the whistle sound when the workout ends
      new Audio('audio/whistle.mp3').play(); // Add your whistle audio file here
      
      startWorkoutButton.disabled = false;
      return;
    }
  }, 1000);

  // Change instruction every 5 seconds
  instructionInterval = setInterval(() => {
    const randomInstruction = getRandomInstruction();
    instructionDisplay.textContent = randomInstruction.name;

    // Play the corresponding audio file
    new Audio(randomInstruction.audio).play();
  }, 5000); // Every 5 seconds
}

// Event listener for the start button
startWorkoutButton.addEventListener('click', startWorkout);
