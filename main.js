const welcomeScreen = document.getElementById('welcome-screen');
const startButton = document.getElementById('start-button');
const entryTypePrompt = document.getElementById('entry-type-prompt');
const entryTypeSelect = document.getElementById('entry-type');
const entryTypeNextButton = document.getElementById('entry-type-next');
const changePastPrompt = document.getElementById('change-past-prompt');
const changePastText = document.getElementById('change-past-text');
const pastTextNextButton = document.getElementById('past-text-next');
const changesResultsPrompt = document.getElementById('changes-results-prompt');
const changesResultsText = document.getElementById('changes-results-text');
const saveButton = document.getElementById('save-entry');
const entryList = document.getElementById('entry-list');

let audioCaptions;
let currentStep = 0;
let currentAudio = null;

let userInput = {
    changePastText: '',
    changesResultsText: '',
};

startButton.addEventListener('click', () => {
    welcomeScreen.style.display = 'none';
    entryTypePrompt.style.display = 'block';
    currentStep = 1;

    userInput = {
        changePastText: '',
        changesResultsText: '',
    };
});

entryTypeNextButton.addEventListener('click', () => {
    entryTypePrompt.style.display = 'none';
    changePastPrompt.style.display = 'block';
    currentStep = 2;
    changePastText.value = userInput.changePastText;
});

pastTextNextButton.addEventListener('click', () => {
    changePastPrompt.style.display = 'none';
    changesResultsPrompt.style.display = 'block';
    currentStep = 3;
    changesResultsText.value = userInput.changesResultsText;
});

function createEntryElement(type, text, changes, timestamp) {
        const li = document.createElement('li');
        const date = new Date(timestamp);
        const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;
        li.innerHTML = `
            <strong>${type.toUpperCase()}:</strong> ${text}<br>
            <strong>CHANGES:</strong> ${changes}<br>
            <strong>RECORDED:</strong> ${formattedDate}`;
        return li;
}

function saveEntryToLocalStorage(type, text, changes, timestamp) {
    const entry = {
        type, 
        text,
        changes,
        timestamp,
    };
    
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    entries.push(entry);
    
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
};

let entryDetailsVisible = false;

function displayEntriesFromLocalStorage() {
    const entries = JSON.parse(localStorage.getItem('journalEntries')) || [];

    const dateList = document.getElementById('entry-date-list');
    dateList.innerHTML = '';

    entries.forEach((entry) => {
        const date = new Date(entry.timestamp);
        const formattedDate = `${date.toLocaleDateString()} at ${date.toLocaleTimeString()}`;

        const listItem = document.createElement('li');
        listItem.textContent = formattedDate;
        listItem.addEventListener('click', () => displayEntryDetails(entry));

        dateList.appendChild(listItem);
    });
}

function displayEntryDetails(entry) {
    const entryDetailsContainer = document.getElementById('entry-details');

    if (entryDetailsContainer.style.display === 'block') {
        entryDetailsContainer.style.display = 'none';
    } else {
        entryDetailsContainer.style.display = 'block';

        const formattedDate = new Date(entry.timestamp).toLocaleString();

        const entryDetailsDiv = document.createElement('div');

        entryDetailsDiv.style.backgroundColor = '#ffffff';
        entryDetailsDiv.style.padding = '10px';

        entryDetailsDiv.innerHTML = `
        <strong>${entry.type.toUpperCase()}:</strong> ${entry.text}<br>
        <strong>CHANGES:</strong> ${entry.changes}<br>
        <strong>RECORDED:</strong> ${formattedDate}
        `;

        const minimizeButton = document.createElement('button');
        minimizeButton.textContent = '-';
        minimizeButton.addEventListener('click', () => {
            entryDetailsContainer.style.display = 'none';
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'X';
        deleteButton.addEventListener('click', () => deleteEntry(entry.timestamp));

        entryDetailsDiv.appendChild(minimizeButton);
        entryDetailsDiv.appendChild(deleteButton);

        entryDetailsContainer.innerHTML = '';
        entryDetailsContainer.appendChild(entryDetailsDiv);
    }
}


function playDeleteAudio() {
    const deleteAudio = new Audio('media/damn_straight.mp3');
    const subtitlesElement = document.getElementById('subtitles');
    
    deleteAudio.play();
    subtitlesElement.textContent = 'Damn straight!';
}

function deleteEntry(timestamp) {
    let entries = JSON.parse(localStorage.getItem('journalEntries')) || [];
    
    const entryToDelete = entries.find((entry) => entry.timestamp === timestamp);

    if (entryToDelete) {
        playDeleteAudio();
        
        entries = entries.filter((entry) => entry.timestamp !== timestamp);
        
        localStorage.setItem('journalEntries', JSON.stringify(entries));
        
        const entryDetailsContainer = document.getElementById('entry-details');
        entryDetailsContainer.style.display = 'none';
        entryDetailsContainer.innerHTML = '';
        
        displayEntriesFromLocalStorage();
    }
}

saveButton.addEventListener('click', () => {
    const type = entryTypeSelect.value;
    const text = changePastText.value.trim();
    const changes = changesResultsText.value.trim();

    if (currentStep === 2) {

        if (text = '') {
            alert('You need to put a little something at least');
            return;
        }
        userInput.changePastText = text;
    } else if (currentStep === 3) {
        if (changes === '') {
            alert('You need to put a little something at least');
            return;
        }
        userInput.changesResultsText = changes;
    }

    const timestamp = Date.now();
    saveEntryToLocalStorage(type, text, changes, timestamp);

    userInput.changePastText = text;
    userInput.changesResultsText = changes;

    displayEntriesFromLocalStorage();

    changePastText.value = '';
    changesResultsText.value = '';

    changePastPrompt.style.display = 'none';
    changesResultsPrompt.style.display = 'none';
    entryTypePrompt.style.display = 'none';
    welcomeScreen.style.display = 'block';
    currentStep = 0;
});

window.addEventListener('load', () => {
    displayEntriesFromLocalStorage();

    // if (localStorage.getItem('journalEntries')) {
    //     welcomeScreen.style.display = 'block';
    //     entryTypePrompt.style.display = 'none';
    // }
});

const previousButton = document.getElementById('previous-button');
const previousButtonFinal = document.getElementById('final-previous-button');
const nextButton = document.getElementById('next-button');

previousButton.addEventListener('click', () => {
    if (currentStep === 2) {
        changePastPrompt.style.display = 'none';
        entryTypePrompt.style.display = 'block';
        currentStep = 1;
    }
});

previousButtonFinal.addEventListener('click', () => {
    if (currentStep === 3) {
        changesResultsPrompt.style.display = 'none';
        changePastPrompt.style.display = 'block';
        currentStep = 2;
    }
})

nextButton.addEventListener('click', () => {
    if (currentStep === 2) {
        changePastPrompt.style.display = 'none';
        changesResultsPrompt.style.display = 'block';
        currentStep = 3;
    }
});


audioCaptions = {
    'entry-type-audio': "Well, was it something ya dun said or did?",
    'changes-results-audio': "Shit, I've been there",
    'change-past-audio': "So you how reckon you'd change things?",
    // 'damn_straight.mp3': "Damn straight!",
    'save': "Thanks for sharing, bub!",
    'for_real': "What the shit! For real?",
    // 'inquiry.mp3': "What's on your mind? Something from the past?",
    // 'makes_sense.mp3': "Nah, I get it. Makes complete sense.",
    // 'me_too.mp3': "Goddamn! Me too.",
    // 'memberin_time.mp3': "It's memberin' time.",
    // 'right_on.mp3': "Right on, you sumbitch.",
    // 'win.mp3': "Hell fucking yeah, I'll drink to that.",
    'little-bit': "It's all right to bitch a little bit."
}

function playAudio(audioId) {
    const audio = document.getElementById(audioId);
    audio.volume = .6;
    const subtitlesElement = document.getElementById('subtitles');

    if (currentAudio) {
        currentAudio.pause();
    }

    if (audio) {
        audio.play();

        if (audioCaptions[audioId]) {
            subtitlesElement.textContent = audioCaptions[audioId];
            console.log(`Subtitle: ${audioCaptions[audioId]}`);
        }
        currentAudio = audio;
    }
}

const backgroundAudio = document.getElementById('background-music');
backgroundAudio.volume = 0.3;

const stopAudioIcon = document.querySelector('.mute');
function stopBackgroundAudio() {
    if (backgroundAudio.muted) {
        backgroundAudio.muted = false;
        stopAudioIcon.classList.remove('fa-volume-xmark', 'fa-lg', 'mute');
        stopAudioIcon.classList.add('fa-volume-high', 'fa-lg');
    } else {
        backgroundAudio.muted = true;
        stopAudioIcon.classList.remove('fa-volume-high', 'fa-lg');
        stopAudioIcon.classList.add('fa-volume-xmark', 'fa-lg', 'mute');
    }
}

stopAudioIcon.addEventListener('click', stopBackgroundAudio);

const fireElement = document.querySelector('.fire');

const parts = 50;

for (let i = 0; i < parts; i++) {
    const particleElement = document.createElement('div');
    particleElement.classList.add('particle');
    particleElement.style.animationDelay = `${1 * Math.random()}s`;
    particleElement.style.left = `calc((100% - 5em) * ${i / parts})`;
    fireElement.appendChild(particleElement);
}